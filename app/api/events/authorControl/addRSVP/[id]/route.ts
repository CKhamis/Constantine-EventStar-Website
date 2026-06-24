import {Prisma, PrismaClient} from '@prisma/client';
import {NextResponse} from "next/server";
import {authorAddRsvpSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";
import {NoisyRSVP} from "@/app/api/events/notify/set/[id]/route";
import axios from "axios";

const prisma = new PrismaClient();

export async function POST(request: Request, {params}: { params: Promise<{ id: string }> }){
    const session = await auth();

    // Require login
    if(!session || !session.user){
        return NextResponse.json("Please sign in", {status: 401});
    }

    // Get event id from uri
    const resolvedParams = await params;
    const eventId = resolvedParams.id;

    // Verify body matches author rsvp delete
    const body = await request.json();
    const validation = authorAddRsvpSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        // Get optional event
        const optionalEvent = await prisma.event.findFirst({
            where: {
                id: eventId,
            },
            include: {
                author: true
            }
        });

        // Reject if event does not exist
        if(!optionalEvent){
            return NextResponse.json({error: "Event not found"}, {status: 404});
        }

        // Check if the requesting user is the author
        if(optionalEvent.author.id !== session.user.id){
            return NextResponse.json({error: "Please log in with author account"}, {status: 403});
        }
        if(body.userId){
            // Id was specified, meaning request is to add an existing EventStar user
            const optionalUser = await prisma.user.findFirst({
                where: {
                    id: body.userId
                }
            });

            // Check if the user's id belongs to a user
            if(!optionalUser){
                return NextResponse.json({error: "Event found, but specified user id: " + body.userId + " has no matching results."}, {status: 401});
            }

            const optionalUserRSVP = await prisma.rsvp.findFirst({
                where: {
                    userId: body.userId,
                    eventId: eventId,
                }
            });

            // This endpoint ONLY creates new RSVPs. Will reject any that are editing. There's another endpoint for editing and deleting
            if(optionalUserRSVP){
                return NextResponse.json({error: "RSVP already exists. Use /changeRSVP/id instead."}, {status: 401});
            }

            // Event exists, user is the author of the event, and the RSVP does not already exist
            await prisma.rsvp.create({
                data: {
                    userId: body.userId,
                    eventId: eventId,
                    guests: body.guests,
                    response: body.response
                }
            });

            // Is Noisy enabled?
            if(process.env.NOISY_URL){
                try {
                    const discord = await prisma.discordConnection.findFirst({
                        where: {
                            userId: optionalUser.id,
                        },
                        select: {
                            defaultFreq: true,
                            discordId: true,
                        }
                    });

                    if(discord && discord.discordId && discord.defaultFreq){
                        const payload: NoisyRSVP = {
                            user_id: discord.discordId,
                            responded: body.response,
                            notify_amount: discord.defaultFreq,
                            event_id: eventId
                        };

                        // Transmit RSVP information
                        await axios.post(`${process.env.NOISY_URL}/set_guest_response`, payload);
                    }
                } catch (noisyError){
                    console.error("Noisy notification failed:", noisyError);
                }
            }

            return NextResponse.json({error: "RSVP generated for EventStar user"}, {status: 202});
        } else {
            // body id is not specified, meaning this is a write-in rsvp

            const optionalWriteInRSVP = await prisma.rsvp.findFirst({
                where: {
                    firstName: body.firstName,
                    lastName: body.lastName,
                    eventId: eventId,
                }
            });

            // Check if the write-in rsvp exists already. Reject if it does
            if(optionalWriteInRSVP){
                return NextResponse.json({error: "RSVP already exists. Use /changeRSVP/id instead."}, {status: 401});
            }

            // Create rsvp if it does not exist
            await prisma.rsvp.create({
                data: {
                    eventId: eventId,
                    guests: body.guests,
                    response: body.response,
                    firstName: body.firstName,
                    lastName: body.lastName
                }
            });

            return NextResponse.json({error: "RSVP generated for Write-In user"}, {status: 202});
        }

    } catch (error){
        if(
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ){
            return NextResponse.json(
                {error: "RSVP already exists for this user and event."},
                {status: 409}
            );
        }

        console.error(error);
        return NextResponse.json(
            {error: "An error occurred while creating RSVP"},
            {status: 500}
        );
    }
}

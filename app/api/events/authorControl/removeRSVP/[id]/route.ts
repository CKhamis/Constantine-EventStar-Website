import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import {uuidSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";
import {NoisyRSVP} from "@/app/api/events/notify/set/[id]/route";
import axios from "axios";
import {NoisyGuest} from "@/app/api/events/save/route";

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session =  await auth();

    // Require login
    if(!session || !session.user){
        return NextResponse.json("Please sign in", {status: 401});
    }

    // Get event id from uri
    const resolvedParams = await params;
    const eventId = resolvedParams.id;

    // Verify body matches author rsvp delete
    const body = await request.json();
    const validation = uuidSchema.safeParse(body);

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
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        // Check if the requesting user is the author
        if(optionalEvent.author.id !== session.user.id){
            return NextResponse.json({ error: "Please log in with author account" }, { status: 403 });
        }

        // Get optional RSVP
        const optionalRSVP = await prisma.rsvp.findFirst({
            where: {
                id: body.id
            }
        });

        // reject if rsvp not found
        if(!optionalRSVP) {
            return NextResponse.json({ error: "RSVP not found" }, { status: 404 });
        }

        // reject if the author is removing themself
        if(optionalRSVP.userId !== null && optionalRSVP.userId === optionalEvent.author.id){
            return NextResponse.json({ error: "Author must be in RSVP list" }, { status: 403 });
        }

        // Delete RSVP
        await prisma.rsvp.delete({
            where: {
                id: optionalRSVP.id
            }
        });

        // Is Noisy enabled?
        if (process.env.NOISY_URL) {
            try {
                const discord = await prisma.discordConnection.findFirst({
                    where: {
                        userId: session.user.id,
                    },
                    select: {
                        defaultFreq: true,
                        discordId: true,
                    }
                });

                if (discord && discord.discordId && discord.defaultFreq) {
                    // Just need to know if they HAVE a discord connection at all, so it can be disabled here
                    const payload: NoisyRSVP = {
                        user_id: discord.discordId,
                        responded: 'NotGoing',
                        notify_amount: 0,
                        event_id: eventId
                    };

                    // Transmit RSVP information
                    await axios.post(`${process.env.NOISY_URL}/set_guest_response`, payload);
                }
            } catch (noisyError) {
                console.error("Noisy notification failed:", noisyError);
            }
        }

        return NextResponse.json("You have removed an RSVP with " + optionalRSVP.guests + " +1s.", { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 500 });
    }
}

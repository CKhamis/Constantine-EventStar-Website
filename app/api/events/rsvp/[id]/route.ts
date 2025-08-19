import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import {rsvpSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session =  await auth();

    const resolvedParams = await params;
    const eventId = resolvedParams.id;

    const body = await request.json();
    const validation = rsvpSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        // Retrieve Event status
        const event = await prisma.event.findUnique({
            where: {
                id: eventId,
            },
            include: {
                RSVP: false,
            },
        });

        // If event not found
        if(!event){
            return NextResponse.json({ error: "RSVP not found" }, { status: 404 });
        }

        // If past RSVP due date
        if(event.rsvpDuedate < new Date()){
            return NextResponse.json({ error: "Cannot change RSVP after due date" }, { status: 403 });
        }

        // If the guest count exceeds max
        if(event.maxGuests < body.guests){
            return NextResponse.json({ error: "Too many guests added. Max " + event.maxGuests}, { status: 403 });
        }

        // If RSVP is a write-in
        if(!session || !session.user){
            // If event doesn't allow write-ins
            // TODO: test this
            if(event.inviteVisibility !== "FULL"){
                return NextResponse.json({ error: "Event inaccessible" }, { status: 403 });
            }

            // If write-in information was correctly attached
            if(body.firstName.length <= 1 || body.lastName.length <= 1){
                return NextResponse.json({ error: "First and last names are not specified in write-in RSVP." }, { status: 401 });
            }

            // If write-in specified more than 0 guests (they need to RSVP separately)
            // TODO: should I have this rule?
            if(0 < body.guests){
                return NextResponse.json({ error: "Write - In guests need to RSVP separately" }, { status: 403 });
            }

            // Search for an existing RSVP of the same name and event
            const rsvp = await prisma.rsvp.findFirst({
                where: {
                    eventId:eventId,
                    firstName:body.firstName,
                    lastName:body.lastName
                }
            });

            // If RSVP didn't exist yet
            if (!rsvp) {
                // Create new Write-In RSVP
                const newRsvp = await prisma.rsvp.create({
                    data:{
                        response: body.response,
                        guests: 0,
                        eventId: eventId,
                        firstName: body.firstName,
                        lastName: body.lastName,
                    }
                });

                return NextResponse.json(newRsvp, { status: 200 });
            }

            // Edit the rsvp value
            if(body.response != rsvp.response || body.guests != rsvp.guests){
                const updatedRsvp = await prisma.rsvp.update({
                    where: {
                        id: rsvp.id,
                    },
                    data: {
                        response: body.response,
                        guests: body.guests,
                        updatedAt: new Date(),
                    },
                });
                return NextResponse.json(updatedRsvp, { status: 200 });
            }

            return NextResponse.json("No changes to make", { status: 200 });
        }

        const rsvp = await prisma.rsvp.findFirst({
            where: {
                eventId:eventId,
                userId: session.user.id
            }
        });

        // If RSVP does not exist
        //TODO: check if this works in front end
        if (!rsvp) {
            // If someone tries to RSVP to an invite-only event with an EventStar account
            if(event.inviteVisibility !== "FULL"){
                return NextResponse.json({ error: "Event inaccessible" }, { status: 403 });
            }

            // Add ES user to invite list and update response
            const newRsvp = await prisma.rsvp.create({
                data:{
                    userId: session.user.id,
                    guests: body.guests,
                    eventId: eventId,
                    response: body.response,
                }
            });

            return NextResponse.json(newRsvp, { status: 200 });
        }

        // Edit the rsvp value
        if(body.response != rsvp.response || body.guests != rsvp.guests){
            const updatedRsvp = await prisma.rsvp.update({
                where: {
                    id: rsvp.id,
                },
                data: {
                    response: body.response,
                    guests: body.guests
                },
            });
            return NextResponse.json(updatedRsvp, { status: 200 });
        }

        return NextResponse.json("No changes to make", { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 500 });
    }
}

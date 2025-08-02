import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import {rsvpSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session =  await auth();

    if(!session || !session.user){
        return NextResponse.json("Please sign in", {status: 401});
    }

    const resolvedParams = await params;
    const eventId = resolvedParams.id;

    const body = await request.json();
    const validation = rsvpSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        const rsvp = await prisma.rsvp.findFirst({
            where: {
                eventId:eventId,
                userId: session.user.id
            }
        });

        if (!rsvp) {
            return NextResponse.json({ error: "RSVP not found" }, { status: 404 });
        }

        // Check if the end time has already passed
        const event = await prisma.event.findUnique({
            where: {
                id: eventId,
            },
            include: {
                RSVP: false,
            },
        });

        if(!event){
            // this should never happen given the SQL schema
            return NextResponse.json({ error: "RSVP not found" }, { status: 404 });
        }

        if(event.rsvpDuedate < new Date()){
            return NextResponse.json({ error: "Cannot change RSVP after due date" }, { status: 403 });
        }

        // Check to see if the guest count exceeds max
        if(event.maxGuests < body.guests){
            return NextResponse.json({ error: "Too many guests added. Max " + event.maxGuests}, { status: 403 });
        }

        // Edit the rsvp value
        if(body.response != rsvp.response){
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

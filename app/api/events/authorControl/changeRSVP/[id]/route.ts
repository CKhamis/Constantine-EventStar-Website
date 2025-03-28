import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import {authorRsvpSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";

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

    // Verify body matches author rsvp edit
    const body = await request.json();
    const validation = authorRsvpSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        // Check if event exists in the first place
        const optionalEvent = await prisma.event.findFirst({
            where: {
                id: eventId,
            },
            include: {
                author: true
            }
        });

        // reject if does not exist
        if(!optionalEvent){
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        // Check if the requesting user is the author
        if(optionalEvent.author.id !== session.user.id){
            return NextResponse.json({ error: "Please log in with author account" }, { status: 403 });
        }

        // Check if user is invited
        const optionalRSVP = await prisma.rsvp.findFirst({
            where: {
                eventId:eventId,
                userId: session.user.id
            }
        });

        // reject if rsvp not found
        if (!optionalRSVP) {
            return NextResponse.json({ error: "RSVP not found" }, { status: 404 });
        }

        // Edit the rsvp value
        await prisma.rsvp.update({
            where: {
                id: optionalRSVP.id
            },
            data: {
                response: body.response,
            }
        })

        return NextResponse.json("You have changed an RSVP to " + body.response, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 500 });
    }
}

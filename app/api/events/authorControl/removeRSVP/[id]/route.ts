import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import {uuidSchema} from "@/components/ValidationSchemas";
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
        if (!optionalRSVP) {
            return NextResponse.json({ error: "RSVP not found" }, { status: 404 });
        }

        // Delete RSVP
        await prisma.rsvp.delete({
            where: {
                id: optionalRSVP.id
            }
        })

        return NextResponse.json("You have removed an RSVP with" + optionalRSVP.guests + " +1s.", { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 500 });
    }
}

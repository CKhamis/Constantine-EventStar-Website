import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import { rsvpAttendanceSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const session =  await auth();

    if(!session || !session.user || session.user.role !== "ADMIN"){
        return NextResponse.json("Please sign in", {status: 401});
    }

    const url = new URL(request.url);
    const eventId = url.searchParams.get('id');

    if (!eventId) {
        return NextResponse.json({ error: "Event ID is missing" }, { status: 400 });
    }

    const body = await request.json();

    if (body.arrivalTime) {
        body.arrivalTime = new Date(body.arrivalTime);
    }

    const validation = rsvpAttendanceSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        const rsvp = await prisma.rsvp.findFirst({
            where: {
                eventId:eventId,
                userId: body.id
            }
        });

        if (!rsvp) {
            return NextResponse.json({ error: "RSVP not found" }, { status: 404 });
        }

        // Edit the rsvp attendance. Toggle presence
        await prisma.rsvp.update({
            where: {
                id: rsvp.id,
            },
            data: {
                arrival: rsvp.arrival? null : (body.arrivalTime? body.arrivalTime : new Date()),
                validator: "Admin"
            },
        });

        // Return the full list of RSVPS
        const rsvps = await prisma.rsvp.findMany({
            where: {
                eventId: eventId,
            },
            include: {
                User: true
            },
        });

        return NextResponse.json(rsvps, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 500 });
    }
}

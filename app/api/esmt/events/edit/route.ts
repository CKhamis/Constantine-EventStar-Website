import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {editEventSchema} from "@/components/ValidationSchemas";


const prisma = new PrismaClient();

export async function POST(request: NextRequest){
    const body = await request.json();

    body.eventStart = new Date(body.eventStart);
    body.eventEnd = new Date(body.eventEnd);
    if (body.rsvpDuedate) {
        body.rsvpDuedate = new Date(body.rsvpDuedate);
    }

    const validation = editEventSchema.safeParse(body);
    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        // Check if event exists
        const existingEvent = await prisma.event.findUnique({
            where: { id: body.id },
        });

        if (!existingEvent) {
            return NextResponse.json({ message: "Event not found" }, { status: 404 });
        }

        // Update Event details
        const updatedEvent = await prisma.event.update({
            where: { id: body.id },
            data: {
                title: body.title,
                address: body.address,
                eventStart: body.eventStart,
                eventEnd: body.eventEnd,
                rsvpDuedate: body.rsvpDuedate,
                description: body.description,
                inviteRigidity: body.inviteRigidity,
                eventType: body.eventType,
                reminderAmount: body.reminderAmount,
                authorId: body.authorId,
            },
        });

        // Add or remove existing invites
        const currentRsvps = await prisma.rsvp.findMany({
            where: { eventId: body.id },
            select: { userId: true },
        });

        const currentUserIds = currentRsvps.map(rsvp => rsvp.userId);

        // Determine RSVPs to delete and add
        const toDelete = currentUserIds.filter((id:string) => !body.RSVP.includes(id));
        const toAdd = body.RSVP.filter((id:string) => !currentUserIds.includes(id));

        // Delete RSVPs
        if (toDelete.length > 0) {
            await prisma.rsvp.deleteMany({
                where: {
                    eventId: body.id,
                    userId: { in: toDelete },
                },
            });
        }

        // Add new RSVPs
        if (toAdd.length > 0) {
            const newRsvps = toAdd.map((userId:string) => ({
                userId,
                eventId: body.id,
            }));
            await prisma.rsvp.createMany({ data: newRsvps });
        }

        return NextResponse.json(updatedEvent, { status: 202 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
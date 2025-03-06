import {PrismaClient} from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {saveEventSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";


const prisma = new PrismaClient();

export async function POST(request: NextRequest){
    const session =  await auth();

    if(!session || !session.user || !session.user.id){
        return NextResponse.json("Approved login required", {status: 401});
    }

    const body = await request.json();
    body.eventStart = new Date(body.eventStart);
    body.eventEnd = new Date(body.eventEnd);
    if (body.rsvpDuedate) {
        body.rsvpDuedate = new Date(body.rsvpDuedate);
    }

    const validation = saveEventSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    // Make sure to invite the author
    body.RSVP.push(session.user.id);

    try {
        // Check if updating
        if(body.id){
            const existingEvent = await prisma.event.findUniqueOrThrow({
                where: { id: body.id },
            });

            if (!existingEvent || existingEvent.authorId !== session.user.id) {
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
                    inviteVisibility: body.inviteVisibility,
                    eventType: body.eventType,
                    backgroundStyle: body.backgroundStyle,
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

            return NextResponse.json(updatedEvent, {status: 202});
        }else{
            const newEvent = await prisma.event.create({
                data: {
                    title: body.title,
                    address: body.address,
                    eventStart: body.eventStart,
                    eventEnd: body.eventEnd,
                    rsvpDuedate: body.rsvpDuedate,
                    description: body.description,
                    inviteVisibility: body.inviteVisibility,
                    eventType: body.eventType,
                    backgroundStyle: body.backgroundStyle,
                    authorId: session.user.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            });

            // Create RSVPs
            const rsvpData = body.RSVP.map((user:string) => {
                return { userId: user, eventId: newEvent.id };
            });

            // console.log(rsvpData);
            const rsvpResponse = await prisma.rsvp.createMany({
                data: rsvpData
            });

            console.log(rsvpResponse);

            return NextResponse.json(newEvent, {status: 201});
        }

    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
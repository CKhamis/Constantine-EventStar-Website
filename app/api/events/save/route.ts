import {PrismaClient} from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {saveEventSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";


const prisma = new PrismaClient();

export async function POST(request: NextRequest){
    const session =  await auth();

    if(!session || !session.user){
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

    console.log(body);
    try {
        // If updating, check for authorship
        if(body.id){
            const existingEvent = await prisma.event.findUniqueOrThrow({
                where: { id: body.id },
            }).catch(() => {
                return NextResponse.json({ message: "Event not found" }, { status: 404 });
            });

            if (!existingEvent || existingEvent.authorId !== session.user.id) {
                return NextResponse.json({ message: "Event not found" }, { status: 404 });
            }
        }

        console.log("passed exist check")

        // Create Event
        const newEvent = await prisma.event.upsert({
            where: {
                id: body.id
            },
            update:{
                title: body.title,
                address: body.address,
                eventStart: body.eventStart,
                eventEnd: body.eventEnd,
                rsvpDuedate: body.rsvpDuedate,
                description: body.description,
                inviteVisibility: body.inviteVisibility,
                eventType: body.eventType,
                backgroundStyle: body.backgroundStyle,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            create: {
                id: body.id,
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
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
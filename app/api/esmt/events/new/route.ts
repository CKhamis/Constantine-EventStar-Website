import {PrismaClient} from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {createEventSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";


const prisma = new PrismaClient();

export async function POST(request: NextRequest){
    const session =  await auth();

    if(!session || !session.user || session.user.role !== "ADMIN"){
        return NextResponse.json("Approved login required", {status: 401});
    }

    const body = await request.json();
    body.eventStart = new Date(body.eventStart);
    body.eventEnd = new Date(body.eventEnd);
    if (body.rsvpDuedate) {
        body.rsvpDuedate = new Date(body.rsvpDuedate);
    }

    const validation = createEventSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: body.authorId },
        });

        if (!existingUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }


        // Create Event
        const newEvent = await prisma.event.create({
            data: {
                title: body.title,
                backgroundStyle: body.backgroundStyle,
                address: body.address,
                eventStart: body.eventStart,
                eventEnd: body.eventEnd,
                rsvpDuedate: body.rsvpDuedate,
                description: body.description,
                inviteRigidity: body.inviteRigidity,
                eventType: body.eventType,
                reminderAmount: body.reminderAmount,
                authorId: body.authorId,
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
import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import {notificationSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";
import axios from "axios";

export type NoisyRSVP = {
    event_id: string,
    user_id: string,
    responded: string | null,
    notify_amount: number
}

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session =  await auth();

    const resolvedParams = await params;
    const eventId = resolvedParams.id;

    const body = await request.json();
    const validation = notificationSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    if(!session || !session.user || !session.user.id){
        return NextResponse.json("Sign in is needed", {status: 400});
    }

    try {
        // Get user's info
        const connection = await prisma.discordConnection.findFirst({
            where: {
                userId: session.user.id
            }
        });

        if(!connection){
            return NextResponse.json("User does not have Discord connected.", { status: 404 });
        }

        // Get user's current response
        const rsvp = await prisma.rsvp.findFirst({
            where: {
                userId: session.user.id,
                eventId: eventId
            }
        });

        if(!rsvp){
            return NextResponse.json("User does not have an existing RSVP", { status: 404 });
        }

        const payload:NoisyRSVP = {
            user_id: session.user.id,
            responded: rsvp.response,
            notify_amount: body.notificationAmount,
            event_id: eventId
        }

        const res =  await axios.post(`${process.env.NOISY_URL}/set_guest_response`, payload);
        console.log(res);

        return NextResponse.json("Notification amount saved.", { status: 202 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while setting the notification" }, { status: 500 });
    }
}

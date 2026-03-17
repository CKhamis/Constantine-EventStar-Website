import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import {notificationSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";
import axios from "axios";

export type GetGuestResponseRequest = {
    event_id: string,
    user_id: string,
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

        const payload:GetGuestResponseRequest = {
            user_id: session.user.id,
            event_id: eventId
        }

        const res =  await axios.post(`${process.env.NOISY_URL}/get_guest_response`, payload);

        return NextResponse.json(res.data, { status: 202 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while setting the notification" }, { status: 500 });
    }
}

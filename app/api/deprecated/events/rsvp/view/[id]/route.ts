import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import {auth} from "@/auth";

const prisma = new PrismaClient();

// THIS IS A POST FUNCTION!!!
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session =  await auth();

    if(!session || !session.user){
        return NextResponse.json("Please sign in", {status: 401});
    }

    const resolvedParams = await params
    const eventId = resolvedParams.id;

    try {
        const rsvp = await prisma.rsvp.findFirst({
            where: {
                eventId: eventId,
                userId: session.user.id
            }
        });

        if (!rsvp) {
            return NextResponse.json({ error: "RSVP not found" }, { status: 404 });
        }

        return NextResponse.json(rsvp, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 500 });
    }
}

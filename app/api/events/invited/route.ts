import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import {auth} from "@/auth";

const prisma = new PrismaClient();

export async function GET() {
    const session = await auth();

    if(!session || !session.user || !session.user.id){
        return NextResponse.json({ error: "Please log in" }, { status: 403 });
    }

    try {
        const events = await prisma.rsvp.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                event:true
            },
            orderBy:{
                createdAt: "desc"
            }
        });

        console.log(events);

        return NextResponse.json(events, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 500 });
    }
}

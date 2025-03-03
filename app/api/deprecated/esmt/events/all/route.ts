import { PrismaClient } from '@prisma/client';
import {NextResponse} from "next/server";
import { auth } from "@/auth"

const prisma = new PrismaClient();

export async function GET(){
    const session =  await auth();

    if(!session || !session.user || session.user.role !== "ADMIN"){
        return NextResponse.json("Please sign in to see all events", {status: 401});
    }

    const allEvents = await prisma.event.findMany({
        where: {
            authorId: session.user.id
        },
        include:{
            RSVP:true
        }
    })
    return NextResponse.json(allEvents, {status: 201});
}
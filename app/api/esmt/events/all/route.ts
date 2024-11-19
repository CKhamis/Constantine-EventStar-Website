import { PrismaClient } from '@prisma/client';
import {NextResponse} from "next/server";

const prisma = new PrismaClient();

export async function GET(){
    const allEvents = await prisma.event.findMany({
        include:{
            RSVP:true
        }
    })
    return NextResponse.json(allEvents, {status: 201});
}
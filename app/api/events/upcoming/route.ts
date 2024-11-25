import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {uuidSchema} from "@/components/ValidationSchemas";

const prisma = new PrismaClient();

// This is a post request!
export async function POST(request: NextRequest){
    const body = await request.json();
    const validation = uuidSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    const allEvents = await prisma.rsvp.findMany({
        where: {
            guestId: body.id
        },
        include:{
            event:true
        },
        orderBy: {
            event: {
                eventStart: 'desc'
            },
        },
    })

    return NextResponse.json(allEvents, {status: 201});
}
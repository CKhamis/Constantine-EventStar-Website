import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {createGuestSchema} from "@/components/ValidationSchemas";


const prisma = new PrismaClient();

export async function POST(request: NextRequest){
    const body = await request.json();
    const validation = createGuestSchema.safeParse(body);

    console.log(body);
    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    const newGuest = await prisma.guest.create({
        data: {firstName: body.firstName, lastName: body.lastName, email: body.email, discordId: body.discordId, phoneNumber: body.phoneNumber},
    })
    return NextResponse.json(newGuest, {status: 201});
}
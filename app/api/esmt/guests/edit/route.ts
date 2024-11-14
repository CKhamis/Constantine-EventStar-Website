import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {editGuestSchema} from "@/components/ValidationSchemas";


const prisma = new PrismaClient();

export async function POST(request: NextRequest){
    const body = await request.json();
    const validation = editGuestSchema.safeParse(body);

    console.log(body);
    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    const newGuest = await prisma.guest.update({
        where: { id:body.id },
        data: {firstName: body.firstName, lastName: body.lastName, email: body.email, discordId: body.discordId, phoneNumber: body.phoneNumber},
    })
    return NextResponse.json(newGuest, {status: 201});
}
import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {createUserSchema} from "@/components/ValidationSchemas";


const prisma = new PrismaClient();

export async function POST(request: NextRequest){
    const body = await request.json();
    const validation = createUserSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    const newUser = await prisma.user.create({
        data: {
            firstName: body.firstName,
            lastName: body.lastName,
            name: body.firstName + ' ' + body.lastName,
            email: body.email,
            discordId: body.discordId,
            phoneNumber: body.phoneNumber
        },
    })
    return NextResponse.json(newUser, {status: 201});
}
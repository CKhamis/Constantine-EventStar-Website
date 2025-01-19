import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {connectionSchema, editUserSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";


const prisma = new PrismaClient();

export async function POST(request: NextRequest){
    const session =  await auth();

    if(!session || !session.user || session.user.role !== "ADMIN"){
        return NextResponse.json("Approved login required", {status: 401});
    }

    const body = await request.json();
    const validation = connectionSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: body.id },
        });

        if (!existingUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Update the user
        const updatedUser = await prisma.user.update({
            where: { id: body.id },
            data: {
                name: body.name,
                email: body.email,
                discordId: body.discordId,
                phoneNumber: body.phoneNumber,
                pin: body.pin
            },
        });

        return NextResponse.json(updatedUser, { status: 202 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {editUserSchema} from "@/components/ValidationSchemas";


const prisma = new PrismaClient();

export async function POST(request: NextRequest){
    const body = await request.json();
    const validation = editUserSchema.safeParse(body);

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
                firstName: body.firstName,
                lastName: body.lastName,
                name: body.firstName + ' ' + body.lastName,
                email: body.email,
                discordId: body.discordId,
                phoneNumber: body.phoneNumber,
            },
        });

        return NextResponse.json(updatedUser, { status: 202 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
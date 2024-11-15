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

    try {
        // Check if guest exists
        const existingGuest = await prisma.guest.findUnique({
            where: { id: body.id },
        });

        if (!existingGuest) {
            return NextResponse.json({ message: "Guest not found" }, { status: 404 });
        }

        // Update the guest
        const updatedGuest = await prisma.guest.update({
            where: { id: body.id },
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                discordId: body.discordId,
                phoneNumber: body.phoneNumber,
            },
        });

        return NextResponse.json(updatedGuest, { status: 202 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
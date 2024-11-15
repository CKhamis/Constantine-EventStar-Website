import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {uuidSchema} from "@/components/ValidationSchemas";


const prisma = new PrismaClient();

export async function POST(request: NextRequest){
    const body = await request.json();
    const validation = uuidSchema.safeParse(body);

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

        // delete the guest
        const deletedGuest = await prisma.guest.delete({
            where: { id: body.id },
        });

        return NextResponse.json(deletedGuest, { status: 202 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
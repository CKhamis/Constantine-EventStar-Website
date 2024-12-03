import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {uuidSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";


const prisma = new PrismaClient();

export async function POST(request: NextRequest){
    const session =  await auth();

    if(!session || !session.user || session.user.role !== "ADMIN"){
        return NextResponse.json("Approved login required", {status: 401});
    }

    const body = await request.json();
    const validation = uuidSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        // Check if event exists and is owned by logged in user
        const existingEvent = await prisma.event.findUnique({
            where: {
                id: body.id,
                authorId: session.user.id
            },
        });

        if (!existingEvent) {
            // Prevent event leakage by returning same error
            return NextResponse.json({ message: "Event not found" }, { status: 404 });
        }

        // delete the guest
        const deletedEvent = await prisma.event.delete({
            where: { id: body.id },
        });

        return NextResponse.json(deletedEvent, { status: 202 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
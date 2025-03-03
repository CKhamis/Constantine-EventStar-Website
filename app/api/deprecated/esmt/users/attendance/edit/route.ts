import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {
    editAttendanceSchema,
} from "@/components/ValidationSchemas";
import {auth} from "@/auth";


const prisma = new PrismaClient();

export async function POST(request: NextRequest){
    const session =  await auth();

    if(!session || !session.user || session.user.role !== "ADMIN"){
        return NextResponse.json("Approved login required", {status: 401});
    }

    const body = await request.json();

    if(body.arrivalTime){
        body.arrivalTime = new Date(body.arrivalTime);
    }

    const validation = editAttendanceSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    console.log(body);

    try {
        // Update the rsvp
        await prisma.rsvp.update({
            where: { id: body.id },
            data: {
                arrival: body.arrivalTime,
                validator: "ADMIN"
            },
        });

        return NextResponse.json("User has been added to group", { status: 202 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
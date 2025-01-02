import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {cardEnrollmentSchema} from "@/components/ValidationSchemas";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {

    const body = await request.json();
    const validation = cardEnrollmentSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        const user = await prisma.user.findFirst({
            where:{
                pin: body.pin
            }
        });

        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 401 });
        }

        await prisma.user.update({
            where: {
                pin: body.pin,
            },
            data: {
                cardId: body.id
            }
        })

        return NextResponse.json("User pin has been updated", { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(error, { status: 500 });
    }
}

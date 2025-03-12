import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import {cuidSchema, followRequestReplySchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const session =  await auth();

    if(!session || !session.user){
        return NextResponse.json("Please sign in", {status: 401});
    }

    const body = await request.json();
    const validation = cuidSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {

        // Delete request in either scenario
        await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                following: {
                    disconnect: {
                        id: body.id
                    }
                }
            }
        });

        return NextResponse.json("Removed from following", { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 500 });
    }
}

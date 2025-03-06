import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import {auth} from "@/auth";

const prisma = new PrismaClient();

export async function GET() {
    const session = await auth();

    if(!session || !session.user || !session.user.id){
        return NextResponse.json({ error: "Please log in" }, { status: 403 });
    }

    try {
        //todo: (security) remove id leakage and instead do email only
        const invites = await prisma.followRequest.findMany({
            where: {
                receiverId: session.user.id,
            },
            include: {
                sender: {
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        image: true
                    }
                }
            },
            orderBy:{
                createdAt: "desc"
            }
        });

        return NextResponse.json(invites, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 500 });
    }
}

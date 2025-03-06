import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import {auth} from "@/auth";

const prisma = new PrismaClient();

export type FRResponse = {
    createdAt: Date,
    id: string,
    receiverId: string,
    sender:{
        id:string,
        email:string,
        image:string,
        name:string,
    },
    senderId:string,
    updatedAt: Date,
}

export async function GET() {
    const session = await auth();

    if(!session || !session.user || !session.user.id){
        return NextResponse.json({ error: "Please log in" }, { status: 403 });
    }

    try {
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

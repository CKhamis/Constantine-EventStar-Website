import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import {auth} from "@/auth";

const prisma = new PrismaClient();

export type EIResponse = {
    id: string,
    arrival: null | Date,
    createdAt: Date,
    response: string,
    event: {
        address: string,
        author: {
            id:string,
            email: string,
            name: string,
            image: string,
        },
        backgroundStyle: "#000",
        createdAt: Date,
        description: string,
        eventEnd: Date,
        eventStart: Date,
        eventType: string,
        id: string,
        inviteVisibility: string,
        reminderCount: number,
        rsvpDuedate: Date,
        title: string,
        updatedAt: Date,
    }
}

export async function GET() {
    const session = await auth();

    if(!session || !session.user || !session.user.id){
        return NextResponse.json({ error: "Please log in" }, { status: 403 });
    }

    try {
        const events = await prisma.rsvp.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                event: {
                    include:{
                        author:{
                            select:{
                                id: true,
                                name: true,
                                email: true,
                                image: true
                            }
                        }
                    }
                }
            },
            orderBy:{
                event: {
                    eventStart: "desc"
                }
            }
        });

        return NextResponse.json(events, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 500 });
    }
}

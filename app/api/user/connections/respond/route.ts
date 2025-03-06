import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import {followRequestReplySchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const session =  await auth();

    if(!session || !session.user){
        return NextResponse.json("Please sign in", {status: 401});
    }

    const body = await request.json();
    const validation = followRequestReplySchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        // Check for requests
        const request = await prisma.followRequest.findFirst({
            where: {
                receiverId: session.user.id,
                senderId: body.senderId
            }
        });

        if(!request){
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        // Delete request in either scenario
        await prisma.followRequest.delete({
            where: {
                id: request.id
            }
        })

        if(body.response){
            // Accept follow request
            await prisma.user.update({
                where: {
                    id: session.user.id
                },
                data: {
                    followedBy: {
                        connect:{
                            id: body.senderId
                        }
                    }
                }
            });
            return NextResponse.json("Follow request accepted", { status: 200 });
        }else{
            return NextResponse.json("Follow request rejected", { status: 200 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 500 });
    }
}

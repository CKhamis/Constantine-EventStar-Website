import { PrismaClient } from '@prisma/client';
import {NextResponse} from "next/server";
import {auth} from "@/auth";

const prisma = new PrismaClient();

export type userInfoResponse = {
    createdAt: Date;
    discordId: string | null,
    email: string,
    emailVerified: boolean | null,
    followedBy: {id: string, name: string, email: string, image: string | null, phoneNumber: string}[],
    following: {id: string, name: string, email: string, image: string | null, phoneNumber: string}[],
    id: string,
    image: string | null,
    name: string,
    newEventEmails: boolean,
    phoneNumber: string,
    role: string,
    tutorial: boolean
    updatedAt: Date
    event: Event[]
}

export async function GET(){
    const session =  await auth();

    if(!session || !session.user){
        return NextResponse.json("Approved login required", {status: 401});
    }

    try{
        const user = await prisma.user.findFirstOrThrow({
            where: {
                id: session.user.id
            },
            include: {
                followedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        phoneNumber: true,
                    }
                },
                following: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        phoneNumber: true,
                    }
                },
                event: true
            },
        });
        return NextResponse.json(user, {status: 201});

    }catch(e){
        // This should never happen
        console.error(e);
        return NextResponse.json("Approved login required", {status: 401});
    }
}
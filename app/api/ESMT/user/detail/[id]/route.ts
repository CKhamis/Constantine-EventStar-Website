import {NextResponse} from "next/server";
import {auth} from "@/auth";
import prisma from "@/prisma/client";

import { Prisma } from '@prisma/client';

const optionalUserSelect = {
    id: true,
    name: true,
    email: true,
    image: true,
    phoneNumber: true,
    discordId: true,
    event: {
        select: {
            id: true,
            title: true,
            eventType: true,
        },
    },
    followedBy: {
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phoneNumber: true,
        },
    },
    following: {
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phoneNumber: true,
        },
    },
    accounts: {
        select: {
            id: true,
            provider: true,
            type: true,
            createdAt: true,
        },
    },
    rsvp: {
        select: {
            id: true,
            response: true,
        },
    },
} satisfies Prisma.UserSelect;

export type ESMTUserDetails = Prisma.UserGetPayload<{
    select: typeof optionalUserSelect;
}>;

/**
 * Takes individual user's information in detail. Initially meant for user merging, but can be used for other purposes
 * ESMT only
 * @param request
 * @param params contains the id of the user
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()

    if(!session || !session.user || session.user.role !== "OWNER"){
        return NextResponse.json("Approved login required", {status: 401})
    }

    const resolvedParams = await params
    const userId = resolvedParams.id

    try{
        const optionalUser = await prisma.user.findUnique({
            where: { id: userId },
            select: optionalUserSelect,
        });

        if(optionalUser){
            return NextResponse.json(optionalUser, {status: 201});
        }else{
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
    }catch(e){
        console.log(e);
        return NextResponse.json({ message: "There was an error retrieving user" }, { status: 500 });
    }

}
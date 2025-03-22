import {PrismaClient, User} from '@prisma/client';
import {NextResponse} from "next/server";
import {auth} from "@/auth";

const prisma = new PrismaClient();

export type esmtUser = User & {
    following: {
        id: string,
        name: string,
        email: string,
        image: string,
    }[]
}

export async function GET(){
    const session =  await auth();

    if(!session || !session.user || session.user.role !== "OWNER"){
        return NextResponse.json("Approved login required", {status: 401});
    }

    const allGuests = await prisma.user.findMany({
        include:{
            following:{
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true
                }
            },
        }
    });

    return NextResponse.json(allGuests, {status: 201});
}
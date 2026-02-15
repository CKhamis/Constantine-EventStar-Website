import {Prisma, PrismaClient} from '@prisma/client';
import {NextResponse} from "next/server";
import {auth} from "@/auth";

const prisma = new PrismaClient();

const ESMTU = {
    id: true,
    name: true,
    email: true,
    image: true,
    phoneNumber: true,
    role: true,
    following: {
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
        },
    },
    discordConnection: {
        select: {
            id: true,
            name: true,
            discordId: true,
        },
    },
} satisfies Prisma.UserSelect;

export type esmtUser = Prisma.UserGetPayload<{
    select: typeof ESMTU;
}>;

export async function GET(){
    const session =  await auth();

    if(!session || !session.user || session.user.role !== "OWNER"){
        return NextResponse.json("Approved login required", {status: 401});
    }

    const allGuests = await prisma.user.findMany({
        select: ESMTU,
    });

    return NextResponse.json(allGuests, {status: 201});
}
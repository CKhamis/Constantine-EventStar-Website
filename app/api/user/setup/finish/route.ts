import { PrismaClient } from '@prisma/client';
import {NextResponse} from "next/server";
import {auth} from "@/auth";


const prisma = new PrismaClient();

export async function POST(){
    const session =  await auth();

    if(!session || !session.user){
        return NextResponse.json("Approved login required", {status: 401});
    }

    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        // Reject if user does not exist or the user's ids don't match.
        if (!existingUser || existingUser.id !== session.user.id) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Update the user
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                tutorial:false,
            }
        });

        return NextResponse.json(updatedUser, { status: 202 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
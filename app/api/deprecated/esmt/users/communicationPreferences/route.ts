import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/auth";


const prisma = new PrismaClient();

export async function POST(request: NextRequest){
    const session =  await auth();

    if(!session || !session.user){
        return NextResponse.json("Approved login required", {status: 401});
    }

    const body:{id: string, emailNewEvents: boolean} = await request.json();

    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: body.id },
        });

        // Reject if user does not exist or the user's ids don't match.
        // Also rejects admins, but they have their own api
        if (!existingUser || existingUser.id !== body.id) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Update the user
        const updatedUser = await prisma.user.update({
            where: { id: body.id },
            data: {
                newEventEmails: body.emailNewEvents
            },
        });

        return NextResponse.json(updatedUser, { status: 202 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
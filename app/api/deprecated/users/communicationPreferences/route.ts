import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/auth";


const prisma = new PrismaClient();

export async function POST(request: NextRequest){
    const session =  await auth();

    const body:{emailNewEvents: boolean} = await request.json();

    try {
        // Update the user
        const updatedUser = await prisma.user.update({
            where: { id: session?.user?.id },
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
import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {cuidSchema, editUserSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";


const prisma = new PrismaClient();

export async function POST(request: NextRequest){
    const session =  await auth();

    if(!session || !session.user){
        return NextResponse.json("Approved login required", {status: 401});
    }

    const body = await request.json();
    const validation = cuidSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        // Check for the amount of accounts for the given user
        const existingAccounts = await prisma.account.findMany({
            where: { userId: session.user.id},
        });

        // Reject if user has one or less account
        if (existingAccounts.length <= 1) {
            return NextResponse.json({ message: "You need one or more sign in providers to sign in." }, { status: 401 });
        }

        // Delete the account
        await prisma.account.delete({
            where:{
                id: body.id
            }
        });

        return NextResponse.json("Account deleted", { status: 202 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
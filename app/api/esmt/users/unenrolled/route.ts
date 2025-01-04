import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {cuidSchema, editUserSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";


const prisma = new PrismaClient();

/**
 * Returns all users who do not have any way to log in yet
 * @param request
 * @constructor
 */
export async function GET(request: NextRequest){
    const session =  await auth();

    if(!session || !session.user || session.user.role !== "ADMIN"){
        return NextResponse.json("Approved login required", {status: 401});
    }

    try {
        const usersWithoutAccounts = await prisma.user.findMany({
            where: {
                accounts: {
                    none: {},
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });

        return NextResponse.json(usersWithoutAccounts, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
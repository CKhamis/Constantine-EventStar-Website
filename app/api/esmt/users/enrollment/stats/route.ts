import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/auth";


const prisma = new PrismaClient();

/**
 * Returns various statistics regarding user accounts and enrollments
 * @param request
 * @constructor
 */
export async function GET(request: NextRequest){
    const session =  await auth();

    if(!session || !session.user || session.user.role !== "ADMIN"){
        return NextResponse.json("Approved login required", {status: 401});
    }

    try {
        // Get most popular providers
        const providers = await prisma.account.groupBy({
            by: ['provider'],
            _count: {
                provider: true,
            },
            orderBy: {
                _count: {
                    provider: 'desc',
                },
            },
        })

        return NextResponse.json(providers, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
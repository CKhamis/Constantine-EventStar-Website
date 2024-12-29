import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {cuidSchema, editUserSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";


const prisma = new PrismaClient();

/**
 * Returns all active and inactive enrollers
 * @param request
 * @constructor
 */
export async function GET(request: NextRequest){
    const session =  await auth();

    if(!session || !session.user || session.user.role !== "ADMIN"){
        return NextResponse.json("Approved login required", {status: 401});
    }

    try {
        const enrollers = await prisma.enroller.findMany({
            include:{
                user: true,
                author:true
            }
        });

        console.log(enrollers);

        return NextResponse.json(enrollers, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
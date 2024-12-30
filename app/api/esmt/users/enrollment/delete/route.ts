import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {cuidSchema, editUserSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";


const prisma = new PrismaClient();

/**
 * Deletes a single enroller
 * @param request
 * @constructor
 */
export async function POST(request: NextRequest){
    const session =  await auth();

    if(!session || !session.user || session.user.role !== "ADMIN"){
        return NextResponse.json("Approved login required", {status: 401});
    }

    const body = await request.json();
    const validation = cuidSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        await prisma.enroller.delete({
            where:{
                id: body.id
            }
        });

        return NextResponse.json("Enroller deleted", { status: 202 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
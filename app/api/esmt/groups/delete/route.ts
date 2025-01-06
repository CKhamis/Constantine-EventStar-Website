import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {cuidSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";


const prisma = new PrismaClient();

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
        const existingGroup = await prisma.group.findUnique({
            where: {
                id: body.id,
            }
        });

        if(!existingGroup) {
            return NextResponse.json({ message: "Group not found" }, { status: 404 });
        }

        const deletedGroup = await prisma.group.delete({
            where: { id: body.id },
        })

        return NextResponse.json(deletedGroup, { status: 202 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {editGroupSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";


const prisma = new PrismaClient();

export async function POST(request: NextRequest){
    const session =  await auth();

    if(!session || !session.user || session.user.role !== "ADMIN"){
        return NextResponse.json("Approved login required", {status: 401});
    }

    const body = await request.json();
    const validation = editGroupSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    const newGroup = await prisma.group.update({
        where:{
            id: body.id ,
        },
        data: {
            name: body.name,
            status: body.status,
            description: body.description,
        },
    });

    await prisma.group.update({
        where: {id: newGroup.id},
        data: {
            users: {
                set: body.users?.map((userId:string) => ({id: userId})) || []
            }
        }
    });

    return NextResponse.json(newGroup, {status: 201});
}
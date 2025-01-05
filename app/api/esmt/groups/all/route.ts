import { PrismaClient } from '@prisma/client';
import {NextResponse} from "next/server";
import {auth} from "@/auth";

const prisma = new PrismaClient();

export async function GET(){
    const session =  await auth();

    if(!session || !session.user || session.user.role !== "ADMIN"){
        return NextResponse.json("Approved login required", {status: 401});
    }

    const allGroups = await prisma.group.findMany({
        include:{
            users:true
        }
    })
    return NextResponse.json(allGroups, {status: 201});
}
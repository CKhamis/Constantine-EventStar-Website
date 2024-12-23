import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {cuidSchema} from "@/components/ValidationSchemas";

const prisma = new PrismaClient();

export async function POST(request: NextRequest){
    const body = await request.json();
    const validation = cuidSchema.safeParse(body);


    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try{
        const connectedAccounts = await prisma.account.findMany({
            where: {
                userId: body.id
            },
            select:{
                id: true,
                provider: true,
                updatedAt: true,
                createdAt: true,
            }
        });

        return NextResponse.json(connectedAccounts, {status: 201});
    }catch(e){
        console.error(e);
        return NextResponse.json("There was an error handling the request", {status: 401});
    }
}
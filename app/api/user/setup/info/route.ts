import { PrismaClient } from '@prisma/client';
import {NextResponse} from "next/server";
import {auth} from "@/auth";

const prisma = new PrismaClient();

/**
 * Retrieves data of user inside the Email Form step in the tutorial
 * @constructor
 */
export async function GET(){
    const session =  await auth();

    if(!session || !session.user){
        return NextResponse.json("Approved login required", {status: 401});
    }

    try{
        const user = await prisma.user.findFirstOrThrow({
            where: {
                id: session.user.id
            },
            select:{
                discordId: true,
                name: true,
                phoneNumber: true,
                image:true,
                discordConnection: true,
            }
        });

        const { discordConnection, ...rest } = user;
        
        return NextResponse.json({
            ...rest,
            discordId: discordConnection?.discordId ?? null
        }, {status: 201});

    }catch(e){
        // This should never happen
        console.error(e);
        return NextResponse.json("Approved login required", {status: 401});
    }
}
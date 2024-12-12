import { PrismaClient } from '@prisma/client';
import {NextResponse} from "next/server";
import {auth} from "@/auth";

const prisma = new PrismaClient();

export async function GET(){
    const session =  await auth();

    if(!session || !session.user){
        return NextResponse.json("Approved login required", {status: 401});
    }

    try{
        const user = await prisma.user.findFirstOrThrow({
                where: {
                    id: session.user.id
                }
            });
        return NextResponse.json(user, {status: 201});
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }catch(e){
        // This should never happen
        return NextResponse.json("Approved login required", {status: 401});
    }
}
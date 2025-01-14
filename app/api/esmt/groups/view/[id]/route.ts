import { PrismaClient } from '@prisma/client';
import {NextResponse} from "next/server";
import {auth} from "@/auth";

const prisma = new PrismaClient();

type Params = Promise<{ id: string }>

export async function generateMetadata(props: { params: Params }):Promise<string> {
    const params = await props.params
    return params.id
}

export async function GET(request: Request, props: { params: Params }){
    const session =  await auth();
    const params = await props.params
    const id = params.id;

    if(!session || !session.user || session.user.role !== "ADMIN"){
        return NextResponse.json("Approved login required", {status: 401});
    }

    const group = await prisma.group.findFirst({
        where:{
            id: id
        },
        include:{
            users:true
        }
    })
    return NextResponse.json(group, {status: 201});
}
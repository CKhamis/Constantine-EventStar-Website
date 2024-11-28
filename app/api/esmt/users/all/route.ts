import { PrismaClient } from '@prisma/client';
import {NextResponse} from "next/server";

const prisma = new PrismaClient();

export async function GET(){
    const allGuests = await prisma.user.findMany()
    return NextResponse.json(allGuests, {status: 201});
}
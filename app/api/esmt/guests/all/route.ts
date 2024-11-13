import { PrismaClient } from '@prisma/client';
import {NextResponse} from "next/server";

const prisma = new PrismaClient();

export async function GET(){
    const allGuests = await prisma.guest.findMany()
    return NextResponse.json(allGuests, {status: 201});
}
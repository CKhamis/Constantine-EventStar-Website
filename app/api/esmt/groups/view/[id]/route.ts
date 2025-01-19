import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        const resolvedParams = await params;
        const id = resolvedParams.id;

        if (!session || !session.user || session.user.role !== "ADMIN") {
            return NextResponse.json("Approved login required", { status: 401 });
        }

        const group = await prisma.group.findFirst({
            where: {
                id: id
            },
            include: {
                users: true
            }
        });

        return NextResponse.json(group, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch group" }, { status: 500 });
    }
}
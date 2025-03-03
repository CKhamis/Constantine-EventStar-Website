import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    try {
        const rsvps = await prisma.rsvp.findMany({
            where: {
                eventId: id,
            },
            include: {
                User: true
            },
        });

        return NextResponse.json(rsvps, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = await params;

    try {
        const rsvps = await prisma.rsvp.findMany({
            where: {
                eventId: id,
            },
            include: {
                Guest: true
            },
        });

        return NextResponse.json(rsvps, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 500 });
    }
}

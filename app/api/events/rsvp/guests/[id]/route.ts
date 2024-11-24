import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

type Params = Promise<{ id: string }>

export async function generateMetadata(props: { params: Params }):Promise<string> {
    const params = await props.params
    return params.id
}

export async function GET(request: Request, props: { params: Params }) {
    const params = await props.params
    const id = params.id;

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

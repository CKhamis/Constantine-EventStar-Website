import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

type Params = Promise<{ id: string }>

export async function generateMetadata(props: { params: Params }):Promise<string> {
    const params = await props.params
    return params.id
}

export async function GET(request: Request, props: { params: Params }) {
    const params = await props.params
    const id = params.id;

    try {
        const event = await prisma.event.findUnique({
            where: {
                id: id,
            },
            include: {
                RSVP: false,
            },
        });

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json(event, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 500 });
    }
}

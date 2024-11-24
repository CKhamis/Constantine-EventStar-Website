import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import {rsvpSchema, uuidSchema} from "@/components/ValidationSchemas";

const prisma = new PrismaClient();

type Params = Promise<{ id: string }>

export async function generateMetadata(props: { params: Params }):Promise<string> {
    const params = await props.params
    return params.id
}

// THIS IS A POST FUNCTION!!!
export async function POST(request: Request, props: { params: Params }) {
    const params = await props.params
    const id = params.id;

    const body = await request.json();
    const validation = uuidSchema.safeParse(body);

    console.log(id)
    console.log(body.guestId)

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        const rsvp = await prisma.rsvp.findFirst({
            where: {
                eventId:id,
                guestId: body.id
            }
        });

        if (!rsvp) {
            return NextResponse.json({ error: "RSVP not found" }, { status: 404 });
        }

        return NextResponse.json(rsvp, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 500 });
    }
}
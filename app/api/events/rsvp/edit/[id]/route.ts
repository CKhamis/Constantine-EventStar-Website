import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import {rsvpSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";

const prisma = new PrismaClient();

type Params = Promise<{ id: string }>

export async function generateMetadata(props: { params: Params }):Promise<string> {
    const params = await props.params
    return params.id
}

export async function POST(request: Request, props: { params: Params }) {
    const session =  await auth();

    if(!session || !session.user){
        return NextResponse.json("Please sign in", {status: 401});
    }

    const params = await props.params
    const eventId = params.id;

    const body = await request.json();
    const validation = rsvpSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        const rsvp = await prisma.rsvp.findFirst({
            where: {
                eventId:eventId,
                userId: session.user.id
            }
        });

        if (!rsvp) {
            return NextResponse.json({ error: "RSVP not found" }, { status: 404 });
        }

        // Edit the rsvp value
        if(body.response != rsvp.response){
            const updatedRsvp = await prisma.rsvp.update({
                where: {
                    id: rsvp.id,
                },
                data: {
                    response: body.response,
                },
            });
            return NextResponse.json(updatedRsvp, { status: 200 });
        }

        return NextResponse.json("No changes to make", { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 500 });
    }
}

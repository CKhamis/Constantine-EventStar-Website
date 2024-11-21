import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import {rsvpSchema, uuidSchema} from "@/components/ValidationSchemas";

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const body = await request.json();
    const validation = rsvpSchema.safeParse(body);

    console.log(id)
    console.log(body.guestId)
    console.log(body.response)

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        const rsvp = await prisma.rsvp.findFirst({
            where: {
                eventId:id,
                guestId: body.guestId
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

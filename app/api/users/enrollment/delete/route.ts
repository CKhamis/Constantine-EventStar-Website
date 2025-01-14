import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {cuidSchema} from "@/components/ValidationSchemas";

const prisma = new PrismaClient();

/**
 * deletes token so it can no longer be used again
 * @param request the request from the front end. This should contain the id of the enrollment ticket.
 * @constructor
 */
export async function POST(request: NextRequest){
    const body = await request.json();
    const validation = cuidSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try{
        // retrieve the enroller that matches the user's id
        await prisma.enroller.delete({
            where: {
                id: body.id
            },
        });

        return NextResponse.json("Enroller deleted from system memory.", {status: 201});
    }catch(e){
        console.error(e);
        return NextResponse.json("There was an error handling the request", {status: 401});
    }
}
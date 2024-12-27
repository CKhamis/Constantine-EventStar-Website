import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {cuidSchema} from "@/components/ValidationSchemas";

const prisma = new PrismaClient();

/**
 * Retrieves user information from a temporary enroller
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
        const enroller = await prisma.enroller.findFirst({
            where: {
                id: body.id
            },
            include: {
                author: {
                    select:{
                        name: true,
                        email: true,
                        image: true,
                    }
                },
                user: true
            }
        });

        if(!enroller){
            return NextResponse.json({ message: "Enroller not found" }, { status: 404 });
        }

        if(new Date(enroller.expires) < new Date()){
            // enroller expired. Delete it
            await prisma.enroller.delete({
                where: {
                    id: enroller.id
                }
            });
            return NextResponse.json({ message: "Enroller expired" }, { status: 402 });
        }

        return NextResponse.json(enroller, {status: 201});
    }catch(e){
        console.error(e);
        return NextResponse.json("There was an error handling the request", {status: 401});
    }
}
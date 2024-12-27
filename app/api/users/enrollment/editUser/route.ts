import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {enrollmentSchema} from "@/components/ValidationSchemas";

const prisma = new PrismaClient();

/**
 * modifies user attributes using consumable token. Does not invalidate tokens
 * @param request the request from the front end. This should contain the id of the enrollment ticket.
 * @constructor
 */
export async function POST(request: NextRequest){
    const body = await request.json();
    const validation = enrollmentSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try{
        // retrieve the enroller that matches the user's id
        const enroller = await prisma.enroller.findFirst({
            where: {
                id: body.enrollerId
            },
            include: {
                user: {
                    select:{
                        id: true,
                    }
                }
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

        // Modify user
        await prisma.user.update({
            where:{
                id: enroller.user.id
            },
            data:{
                phoneNumber: body.phoneNumber,
                email: body.email,
                discordId: body.discordId,
            }
        });

        return NextResponse.json(enroller, {status: 201});
    }catch(e){
        console.error(e);
        return NextResponse.json("There was an error handling the request", {status: 401});
    }
}
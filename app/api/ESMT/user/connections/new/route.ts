import {PrismaClient} from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {cuidSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";


const prisma = new PrismaClient();

export async function POST(request: NextRequest){
    const session =  await auth();

    if(!session || !session.user || session.user.role !== "OWNER" || !session.user.id){
        return NextResponse.json("Approved login required", {status: 401});
    }

    const body = await request.json();
    const validation = cuidSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        // Check if following self
        if(body.id === session.user.id){
            return NextResponse.json({ message: "Cannot follow self" }, {status: 400});
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: body.id },
        });

        if(!existingUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Check to see if already following
        const optionalConnection = await prisma.user.findFirst({
            where: {
                id: body.id,
                following: {
                    some: {
                        id: session.user.id,
                    }
                }
            }
        });

        if(!optionalConnection) {
            // Create follow
            await prisma.user.update({
                where: {
                    id: session.user.id
                },
                data: {
                    followedBy: {
                        connect:{
                            id: body.id
                        }
                    }
                }
            });
            return NextResponse.json({ message: "User solicited" }, {status: 201});
        }

        return NextResponse.json({ message: "User already follows" }, {status: 201});
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
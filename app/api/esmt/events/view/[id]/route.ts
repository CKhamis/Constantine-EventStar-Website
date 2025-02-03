import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import {auth} from "@/auth";

const prisma = new PrismaClient();

/**
 * Gets everything about the selected user
 * @param request only here to add as a tax write-off
 * @param params uses the dynamic route to get the id of the user
 * @constructor
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session =  await auth();

    if(!session || !session.user || session.user.role !== "ADMIN"){
        return NextResponse.json("Approved login required", {status: 401});
    }

    const resolvedParams = await params;
    const eventId = resolvedParams.id;

    try {
        const event = await prisma.event.findFirst({
            where: {
                id: eventId
            },
            include: {
                RSVP: {
                    include: {
                        User: {
                            include: {
                                accounts: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(event, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 520 });
    }
}

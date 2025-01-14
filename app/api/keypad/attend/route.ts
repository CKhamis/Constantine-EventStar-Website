import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {attendanceSchema} from "@/components/ValidationSchemas";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {

    const body = await request.json();
    const validation = attendanceSchema.safeParse(body);

    console.log(body)

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        let user;

        if(body.id.length > 0){
            const recievedUser = await prisma.user.findFirst({
                where:{
                    id: body.id
                }
            });

            if(!recievedUser){
                return NextResponse.json({ error: "User not found" }, { status: 401 });
            }

            user = recievedUser;
        }else if(body.pin.length === 4){
            const recievedUser = await prisma.user.findFirst({
                where:{
                    pin: body.pin
                }
            });

            if(!recievedUser){
                return NextResponse.json({ error: "User not found" }, { status: 401 });
            }

            user = recievedUser;
        }

        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 401 });
        }

        const date = new Date();

        const eventList = await prisma.event.findMany({
            where:{
                eventStart:{
                    lte: date
                },
                eventEnd:{
                    gte: date
                }
            }
        })

        for (const event of eventList) {
            const rsvp = await prisma.rsvp.findFirst({
                where:{
                    userId: user.id,
                    eventId:event.id
                }
            })

            if(!rsvp){
                // Unannounced
                // todo: unimplemented!
                console.error("Uh Oh!!!")
                return NextResponse.json("unannounced", { status: 501 });
            }

            if(rsvp.arrival){
                // already scanned
                return NextResponse.json("You have scanned your card already", { status: 402 });
            }

            await prisma.rsvp.update({
                where:{
                    id: rsvp.id
                },
                data: {
                    arrival: date,
                    validator: body.moduleName
                }
            });

            await prisma.user.update({
                where:{
                    id: user.id
                },
                data:{
                    points: user.points + 1
                }
            })

        }

        console.log(eventList);

        return NextResponse.json("User pin has been updated", { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(error, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import {notificationFrequencySchema, verificationSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

/**
 * Changes the user's notification default frequency
 * @param request
 * @constructor
 */
export async function POST(request: Request) {
    const session =  await auth();

    if(!session || !session.user || !session.user.id){
        return NextResponse.json("Please sign in", {status: 401});
    }

    const body = await request.json();
    const validation = notificationFrequencySchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        // Check if env components exist
        if(process.env.NOISY_URL === undefined || process.env.NOISY_URL === ""){
            return NextResponse.json("Noisy not set up", { status: 500 });
        }

        // Check if the currently signed in user has an active Discord connection to modify in the first place
        const connection = await prisma.discordConnection.findFirst({
            where: {
                userId: session.user.id,
            }
        });

        //Exit if there is no connection
        if(!connection){
            return NextResponse.json("Discord has not been set up with account.", { status: 410 });
        }

        // Modify Discord Connection
        const result = await prisma.discordConnection.update({
            where: { id: connection.id },
            data: { defaultFreq: body.freq }
        });

        if(!result){
            return NextResponse.json("OOPS!! There was an error updating default frequency.", { status: 500 });
        }

        return NextResponse.json("Notification frequcncy updated.", { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while generating a token" }, { status: 500 });
    }
}

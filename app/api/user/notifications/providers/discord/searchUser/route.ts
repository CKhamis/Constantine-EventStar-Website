import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import {discordUsernameSearch} from "@/components/ValidationSchemas";
import {auth} from "@/auth";

/**
 * Uses Noisy to search for Discord usernames or names
 * @param request
 * @constructor
 */
export async function POST(request: Request) {
    const session =  await auth();

    if(!session || !session.user){
        return NextResponse.json("Please sign in", {status: 401});
    }

    const body = await request.json();
    const validation = discordUsernameSearch.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }


    try {

        console.log(process.env.NOISY_URL);

        return NextResponse.json("Removed follower", { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 500 });
    }
}

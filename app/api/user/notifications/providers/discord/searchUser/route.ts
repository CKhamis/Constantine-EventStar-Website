import { NextResponse } from "next/server";
import {discordUsernameSearch} from "@/components/ValidationSchemas";
import {auth} from "@/auth";
import axios from 'axios';

// Return types provided by noisy
export type DiscordUsernameSearchResponse = {
    results: DiscordUsernameSearchResult[]
}

export type DiscordUsernameSearchResult = {
    name: string,
    id: string,
    avatar: string | null,
    global_name: string | null,
}

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
        if(process.env.NOISY_URL === undefined || process.env.NOISY_URL === ""){
            return NextResponse.json("Noisy not set up", { status: 500 });
        }

        // Forward response from Noisy
        const response = await axios.get(
            `${process.env.NOISY_URL}/discord/search_user/${encodeURIComponent(body.username)}`
        );

        return NextResponse.json(response.data, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 500 });
    }
}

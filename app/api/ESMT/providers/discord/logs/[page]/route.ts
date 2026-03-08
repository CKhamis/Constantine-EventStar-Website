import { NextResponse } from "next/server";
import {auth} from "@/auth";
import axios from 'axios';

export type DiscordLogResponse = {
    logs: LogLine[],
}

export type LogLine = {
    timestamp: string,
        level: string,
        fields: {
            message: string,
        },
        target: string,
        span: null | {
            state: string | null,
            name: string | null,
            page: string | null,
            event: string | null,
        },
}

/**
 * Uses Noisy to return a list of logs
 * @param request
 * @param params
 * @constructor
 */
export async function GET(request: Request, { params }: { params: { page: string } }) {
    const session =  await auth();

    if(!session || !session.user){
        return NextResponse.json("Please sign in", {status: 401});
    }

    try {
        if(process.env.NOISY_URL === undefined || process.env.NOISY_URL === ""){
            return NextResponse.json("Noisy not set up", { status: 500 });
        }

        // Forward response from Noisy
        const response = await axios.get<DiscordLogResponse>(`${process.env.NOISY_URL}/get_logs/${params.page}`,);



        return NextResponse.json(response.data, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 500 });
    }
}

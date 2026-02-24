import { NextResponse } from "next/server";
import {discordUsernameSearch, discordUsernameSendVerification} from "@/components/ValidationSchemas";
import {auth} from "@/auth";
import axios from 'axios';
import {PrismaClient} from "@prisma/client";
import {verifyRootLayout} from "next/dist/lib/verify-root-layout";

const prisma = new PrismaClient()

/**
 * Uses Noisy to send a verification number to a Discord account. Also saves a token
 * @param request
 * @constructor
 */
export async function POST(request: Request) {
    const session =  await auth();

    if(!session || !session.user){
        return NextResponse.json("Please sign in", {status: 401});
    }

    const body = await request.json();
    const validation = discordUsernameSendVerification.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        // Check if env components exist
        if(process.env.NOISY_URL === undefined || process.env.NOISY_URL === ""){
            return NextResponse.json("Noisy not set up", { status: 500 });
        }

        // Create random number
        const verificationNumber = Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0");

        // Send random number and user id to Noisy
        const response = await axios.get(
            `${process.env.NOISY_URL}/discord/verify_user_id/${encodeURIComponent(body.id)}/${encodeURIComponent(verificationNumber)}` //todo: make it receive a string instead of an actual number
        );

        console.log(`${process.env.NOISY_URL}/discord/verify_user_id/${encodeURIComponent(body.id)}/${encodeURIComponent(verificationNumber)}`);

        // Check if Noisy had any issues
        if(response.status >= 400 && response.status < 500){
            console.error(response);
            return NextResponse.json("OOPS! There was an error processing your verification number.", { status: 500 });
        }

        // Save verification token
        await prisma.discordToken.create({
            data: {
                userId: session.user.id,
                verificationNumber: verificationNumber,
                discordId: body.id
            }
        });

        // Delete any other verification token that matches the same credentials
        await prisma.discordToken.deleteMany({
            where: {
                userId: session.user.id,
                discordId: body.id
            }
        });

        return NextResponse.json(response.data, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while generating a token" }, { status: 500 });
    }
}

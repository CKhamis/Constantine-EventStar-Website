import { NextResponse } from "next/server";
import {verificationSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

/**
 * Takes in the user OTP, verifies it with an existing, non-expired Discord connection token, and conditionally saves the connection
 * Tokens expire after 20 mins. Will not be valid afterward
 * @param request
 * @constructor
 */
export async function POST(request: Request) {
    const session =  await auth();

    if(!session || !session.user || !session.user.id){
        return NextResponse.json("Please sign in", {status: 401});
    }

    const body = await request.json();
    const validation = verificationSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        // Check if env components exist
        if(process.env.NOISY_URL === undefined || process.env.NOISY_URL === ""){
            return NextResponse.json("Noisy not set up", { status: 500 });
        }

        // Check if the currently signed in user has an active Discord token to verify in the first place
        const token = await prisma.discordToken.findFirst({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Check integrity of token
        const EXPIRE = 20 * 60 * 1000;
        const now = Date.now();

        if (!token || now - new Date(token.createdAt).getTime() > EXPIRE) {
            return NextResponse.json("No active Discord verifications exist for logged in account.", { status: 404 });
        }

        // Integrity of token is validated. Check if verification token matches
        if(token.verificationNumber !== body.vn){
            return NextResponse.json("Incorrect verification number submitted.", { status: 410 });
        }

        // Create new Discord Connection and associate it with logged in account
        const connection = await prisma.discordConnection.upsert({
            where: { userId: session.user.id },
            update: { discordId: token.discordId },
            create: {
                userId: session.user.id,
                discordId: token.discordId,
            },
        });

        if(!connection){
            return NextResponse.json("OOPS!! There was an issue connecting your Discord account.", { status: 500 });
        }

        // Delete any other verification token that was created by that user
        await prisma.discordToken.deleteMany({
            where: {
                userId: session.user.id,
            }
        });

        return NextResponse.json("Discord connection has been successfully made.", { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while generating a token" }, { status: 500 });
    }
}

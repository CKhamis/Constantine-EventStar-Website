import {PrismaClient} from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {emailSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";


const prisma = new PrismaClient();

export async function POST(request: NextRequest){
    const session =  await auth();

    if(!session || !session.user || !session.user.id){
        return NextResponse.json("Approved login required", {status: 401});
    }

    const body = await request.json();
    const validation = emailSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if(!existingUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Check if user referenced exists
        const userToFollow = await prisma.user.findUnique({
            where: { email: body.email },
        });

        if(!userToFollow) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Check if the referenced user is the same user who is requesting
        if(existingUser.id === userToFollow.id){
            return NextResponse.json({ message: "You cannot follow yourself." }, {status: 400});
        }

        // Check to see if a request already exists
        const existingRequest = await prisma.followRequest.findFirst({
            where: {
                receiverId: userToFollow.id,
                senderId: existingUser.id
            },
        });

        if(existingRequest){
            return NextResponse.json({ message: "Request already sent" }, { status: 400 });
        }

        // todo: Check if user is already following

        // Create Follow Request
        const newEvent = await prisma.followRequest.create({
            data: {
                createdAt: new Date(),
                updatedAt: new Date(),
                receiverId: userToFollow.id,
                senderId: existingUser.id,
            }
        });

        return NextResponse.json({ message: "Follow request sent" }, {status: 201});
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
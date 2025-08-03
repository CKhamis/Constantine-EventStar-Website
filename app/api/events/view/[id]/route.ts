import { PrismaClient } from '@prisma/client';
import {NextResponse} from "next/server";
import {auth} from "@/auth";

const prisma = new PrismaClient();

export type EVResponse = {
    address: "",
    author: {
        id: string,
        name: string,
        email: string,
        image: string
    },
    authorId: string,
    backgroundStyle: "#000",
    createdAt: Date,
    maxGuests: number,
    description: "",
    eventEnd: Date,
    eventStart: Date,
    eventType: string,
    id: string,
    inviteVisibility: string,
    reminderCount: number,
    rsvpDuedate: Date,
    title: string,
    updatedAt: Date,
    RSVP: {
        id: string,
        response: string,
        guests: number,
        user: {
            email: string,
            name: string,
            image: string
            id: string,
        }
    }[]
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();

    const resolvedParams = await params
    const eventId = resolvedParams.id;

    try {
        // Fetch all event info
        const event = await prisma.event.findFirst({
            where: {
                id: eventId
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                },
                RSVP: {
                    select: {
                        id: true,
                        response: true,
                        guests: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                                image: true,
                                id: true
                            }
                        }
                    }
                }
            }
        });

        // Reject if event is not found
        if(!event){
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        // Check to see if event is open to public
        if(event.inviteVisibility === "FULL"){
            // Anybody can access. Check to see if they have an account and are invited.

            if(!session || !session.user){
                // User is not logged in. RSVP data NOT included
                return NextResponse.json(event, { status: 200 });
            }

            return NextResponse.json(event, { status: 200 });
        }else if(event.inviteVisibility === "INVITED_ONLY"){
            // Only those who are invited can see. Check to see if they are invited

            // Log in is required. Check if they are signed in
            if(!session || !session.user){
                return NextResponse.json({ error: "Please log in to continue" }, { status: 403 });
            }

            // User IS logged in. Check if they are invited
            const optionalRSVP = await prisma.rsvp.findFirst({
                where: {
                    userId: session.user.id,
                    eventId: eventId
                },
            });

            if(!optionalRSVP){
                // Has an account but was not invited :(
                return NextResponse.json({ error: "Event not found" }, { status: 404 });
            }else{
                // Has an account but is invited
                return NextResponse.json(event, { status: 200 });
            }

        }else{
            // Either NONE or an unmapped visibility

            // Check to see if they are the original author
            if(session && session.user && event.author.id === session.user.id){
                // Author is original

                // Not assuming an rsvp has been created automatically just in case
                const optionalRSVP = await prisma.rsvp.findFirst({
                    where: {
                        userId: session.user.id,
                        eventId: eventId
                    },
                });

                if(!optionalRSVP){
                    // For some reason, RSVP information was not associated to the event. Integrity error
                    return NextResponse.json({ error: "Event not found" }, { status: 500 });
                }else{
                    // Has an account, owns the event, and has an rsvp
                    return NextResponse.json(event, { status: 200 });
                }
            }

            // Not logged in to view event OR logged in but not the author of the event
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 500 });
    }
}

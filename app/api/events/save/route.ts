import { PrismaClient } from "@prisma/client"
import { type NextRequest, NextResponse } from "next/server"
import { saveEventSchema } from "@/components/ValidationSchemas"
import { auth } from "@/auth"
import axios from "axios";
import {format} from "date-fns";

export type NoisyEvent = {
    event_id: string,
    start_time: Date,
    end_time: Date,
    rsvp_due: Date,
    event_type: string,
    event_title: string,
    guest_list: NoisyGuest[],
    notify_threads_spawned: boolean,
}

export type NoisyGuest = {
    user_id: string,
    /// 0: no notifications at all
    /// 1: event created, 1 hour before event start
    /// 2: event created, 1 hour before RSVP due date, 1 day before event start, 1 hour before event start
    /// 3: event created, 1 day before RSVP due date, 1 hour before RSVP due date, 2 days before event start, 1 day before event start, 1 hour before event start
    notify_amount: number,
    responded: 'Going' | 'NotGoing' | 'MaybeGoing' | 'NoResponse'
}

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    const session = await auth()

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json("Approved login required", { status: 401 })
    }

    const body = await request.json()
    body.eventStart = new Date(body.eventStart)
    body.eventEnd = new Date(body.eventEnd)
    if (body.rsvpDuedate) {
        body.rsvpDuedate = new Date(body.rsvpDuedate)
    }

    const validation = saveEventSchema.safeParse(body)

    if (!validation.success) {
        return NextResponse.json(validation.error.format(), { status: 400 })
    }

    try {
        // Check if updating
        if (body.id) {
            const existingEvent = await prisma.event.findUniqueOrThrow({
                where: { id: body.id },
            })

            if (!existingEvent || existingEvent.authorId !== session.user.id) {
                return NextResponse.json({ message: "Event not found" }, { status: 404 })
            }

            // Update Event details
            const updatedEvent = await prisma.event.update({
                where: { id: body.id },
                data: {
                    title: body.title,
                    address: body.address,
                    eventStart: body.eventStart,
                    eventEnd: body.eventEnd,
                    rsvpDuedate: body.rsvpDuedate,
                    description: body.description,
                    inviteVisibility: body.inviteVisibility,
                    eventType: body.eventType,
                    backgroundStyle: body.backgroundStyle,
                    maxGuests: body.maxGuests,
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },
                    RSVP: {
                        select: {
                            id: true,
                            response: true,
                            guests: true,
                            firstName: true,
                            lastName: true,
                            user: {
                                select: {
                                    name: true,
                                    email: true,
                                    image: true,
                                    id: true,
                                },
                            },
                        },
                    },
                },
            })

            return NextResponse.json(updatedEvent, { status: 202 })
        } else {
            const newEvent = await prisma.event.create({
                data: {
                    title: body.title,
                    address: body.address,
                    eventStart: body.eventStart,
                    eventEnd: body.eventEnd,
                    rsvpDuedate: body.rsvpDuedate,
                    description: body.description,
                    inviteVisibility: body.inviteVisibility,
                    eventType: body.eventType,
                    backgroundStyle: body.backgroundStyle,
                    authorId: session.user.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    maxGuests: body.maxGuests,
                },
            })

            // Add the trivial RSVP
            await prisma.rsvp.create({
                data: {
                    userId: session.user.id,
                    eventId: newEvent.id,
                },
            })

            const event = await prisma.event.findFirst({
                where: {
                    id: newEvent.id,
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                            discordConnection: true
                        },
                    },
                    RSVP: {
                        select: {
                            id: true,
                            response: true,
                            guests: true,
                            firstName: true,
                            lastName: true,
                            user: {
                                select: {
                                    name: true,
                                    email: true,
                                    image: true,
                                    id: true,
                                },
                            },
                        },
                    },
                },
            });

            // Send event to Noisy
            //todo: make sure this CHECKS if noisy is connected

            if(!event || !event.author.discordConnection){
                // This should never happen
                return NextResponse.json("Author has not set up Discord on their account. No notifications will be sent.", { status: 400 })
            }

            // Send event information to Noisy
            const response = await axios.post(`${process.env.NOISY_URL}/new_event`, {
                event_id: newEvent.id,
                start_time: formatTimestampNoTZ(new Date(newEvent.eventStart)),
                end_time: formatTimestampNoTZ(new Date(newEvent.eventEnd)),
                rsvp_due: formatTimestampNoTZ(new Date(newEvent.rsvpDuedate)),
                event_type: newEvent.eventType,
                event_title: newEvent.title,
                guest_list: [
                    {
                        user_id: event.author.discordConnection.discordId,
                        /// 0: no notifications at all
                        /// 1: event created, 1 hour before event start
                        /// 2: event created, 1 hour before RSVP due date, 1 day before event start, 1 hour before event start
                        /// 3: event created, 1 day before RSVP due date, 1 hour before RSVP due date, 2 days before event start, 1 day before event start, 1 hour before event start
                        notify_amount: 1,
                        responded: 'Going'
                    }
                ],
                notify_threads_spawned: false,
            });

            return NextResponse.json(event, { status: 201 })
        }
    } catch (e) {
        console.error(e)
        return NextResponse.json({ message: "An error occurred" }, { status: 500 })
    }
}

export function formatTimestampNoTZ(date: Date): string {
    // Base ISO without timezone
    const base = format(date, "yyyy-MM-dd'T'HH:mm:ss");

    // Milliseconds (3 digits)
    const ms = format(date, "SSS");

    // Pad to 9 digits (fake nanoseconds)
    const nano = ms.padEnd(9, "0");

    return `${base}.${nano}`;
}
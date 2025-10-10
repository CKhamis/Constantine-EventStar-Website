import { PrismaClient } from "@prisma/client"
import { type NextRequest, NextResponse } from "next/server"
import { saveEventSchema } from "@/components/ValidationSchemas"
import { auth } from "@/auth"

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

            return NextResponse.json(event, { status: 201 })
        }
    } catch (e) {
        console.error(e)
        return NextResponse.json({ message: "An error occurred" }, { status: 500 })
    }
}
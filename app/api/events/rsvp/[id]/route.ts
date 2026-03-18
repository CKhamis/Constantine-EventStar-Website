import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import {rsvpSchema} from "@/components/ValidationSchemas";
import {auth} from "@/auth";
import axios from "axios";

const prisma = new PrismaClient();

export type GetGuestResponseRequest = {
    user_id: string,
    event_id: string,
}

export type NoisyRSVP = {
    user_id: string,
    responded: string,
    notify_amount: number,
    event_id: string,
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();

    const resolvedParams = await params;
    const eventId = resolvedParams.id;

    const body = await request.json();
    const validation = rsvpSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    try {
        // Retrieve Event status
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: { RSVP: false },
        });

        // If event not found
        if(!event){
            return NextResponse.json({ error: "RSVP not found" }, { status: 404 });
        }

        // If past RSVP due date
        if(event.rsvpDuedate < new Date()){
            return NextResponse.json({ error: "Cannot change RSVP after due date" }, { status: 403 });
        }

        // If the guest count exceeds max
        if(event.maxGuests < body.guests){
            return NextResponse.json({ error: "Too many guests added. Max " + event.maxGuests}, { status: 403 });
        }

        // If RSVP is a write-in
        if(!session || !session.user){
            // If event doesn't allow write-ins
            if(event.inviteVisibility !== "FULL"){
                return NextResponse.json({ error: "Event inaccessible" }, { status: 403 });
            }

            // If write-in information was correctly attached
            if(body.firstName.length <= 1 || body.lastName.length < 1){
                return NextResponse.json({ error: "First and last names are not specified in write-in RSVP." }, { status: 401 });
            }

            const rsvp = await prisma.rsvp.findFirst({
                where: { eventId, firstName: body.firstName, lastName: body.lastName }
            });

            // If RSVP didn't exist yet
            if (!rsvp) {
                // Create new Write-In RSVP
                const newRsvp = await prisma.rsvp.create({
                    data: {
                        response: body.response,
                        guests: 0,
                        eventId,
                        firstName: body.firstName,
                        lastName: body.lastName,
                    }
                });
                return NextResponse.json(newRsvp, { status: 200 });
            }

            // Edit the rsvp value
            if(body.response != rsvp.response || body.guests != rsvp.guests){
                const updatedRsvp = await prisma.rsvp.update({
                    where: { id: rsvp.id },
                    data: { response: body.response, guests: body.guests, updatedAt: new Date() },
                });
                return NextResponse.json(updatedRsvp, { status: 200 });
            }

            return NextResponse.json("No changes to make", { status: 200 });
        }

        // Signed-in user flow
        const connection = await prisma.discordConnection.findFirst({
            where: { userId: session.user.id }
        });

        if(!connection){
            return NextResponse.json("User does not have Discord connected.", { status: 404 });
        }

        // Fetch current Noisy notification amount, fall back to account default
        let notifyAmount = connection.defaultFreq;
        try {
            const getPayload: GetGuestResponseRequest = {
                user_id: connection.discordId,
                event_id: eventId,
            };
            const noisyRes = await axios.post(`${process.env.NOISY_URL}/get_guest_response`, getPayload);
            if(noisyRes.data?.notify_amount != null){
                notifyAmount = noisyRes.data.notify_amount;
            }
        } catch {
            // No existing Noisy record — default already set above
        }

        const rsvp = await prisma.rsvp.findFirst({
            where: { eventId, userId: session.user.id }
        });

        // If RSVP does not exist
        let savedRsvp;

        if (!rsvp) {
            // If someone tries to RSVP to an invite-only event with an EventStar account
            if(event.inviteVisibility !== "FULL"){
                return NextResponse.json({ error: "Event inaccessible" }, { status: 403 });
            }

            savedRsvp = await prisma.rsvp.create({
                data: {
                    userId: session.user.id,
                    guests: body.guests,
                    eventId,
                    response: body.response,
                }
            });
        } else if(body.response != rsvp.response || body.guests != rsvp.guests) {
            savedRsvp = await prisma.rsvp.update({
                where: { id: rsvp.id },
                data: { response: body.response, guests: body.guests },
            });
        } else {
            return NextResponse.json("No changes to make", { status: 200 });
        }

        // Sync to Noisy
        const noisyPayload: NoisyRSVP = {
            user_id: connection.discordId,
            responded: savedRsvp.response,
            notify_amount: notifyAmount,
            event_id: eventId,
        };
        await axios.post(`${process.env.NOISY_URL}/set_guest_response`, noisyPayload);

        return NextResponse.json(savedRsvp, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the event" }, { status: 500 });
    }
}
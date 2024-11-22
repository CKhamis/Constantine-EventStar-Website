import {$Enums, Rsvp} from "@prisma/client";

export type EventWithRsvp = {
    id: string
    createdAt: Date
    updatedAt: Date
    title: string
    address: string
    eventStart: Date
    eventEnd: Date
    rsvpDuedate: Date
    description: string
    inviteRigidity: $Enums.InviteRigidity
    eventType: $Enums.EventType
    reminderAmount: $Enums.ReminderAmount
    authorId: string
    RSVP: Rsvp[]
}

export type RsvpWithGuest = {
    id: string,
    createdAt: Date,
    updatedAt: Date,
    eventId: string,
    response: string,
    guestId: string,
    Guest: {
        id: string,
        createdAt: Date,
        updatedAt: Date,
        firstName: string,
        lastName: string,
        phoneNumber: string,
        email: string,
        discordId: string,
        userId: string | null
    }
}
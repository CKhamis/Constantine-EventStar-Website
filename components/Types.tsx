import {$Enums, Event, User, EventType, InviteRigidity, ReminderAmount, Rsvp} from "@prisma/client";

export type EventWithResponse = Event & {
    response: string;
}

export type RsvpWithEvent = {
    "id": string,
    "createdAt": Date,
    "updatedAt": Date,
    "eventId": string,
    "response": string,
    "userId": string,
    "event": {
        "id": string,
        "createdAt": Date,
        "updatedAt": Date,
        "title": string,
        "address": string,
        "eventStart": Date,
        "eventEnd": Date,
        "rsvpDuedate": Date,
        "description": string,
        "inviteRigidity": InviteRigidity,
        "eventType": EventType,
        "reminderAmount": ReminderAmount,
        "authorId": string
    }
}

export type EventWithRsvp = {
    id: string
    backgroundStyle: string
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

export type RsvpWithUser = {
    id: string,
    createdAt: Date,
    updatedAt: Date,
    eventId: string,
    response: string,
    guestId: string,
    User: User
}
import {$Enums, Event, User, Account, EventType, InviteRigidity, ReminderAmount, Rsvp, Status, Group, Session} from "@prisma/client";

export type userWithEventAndGroupsAndRsvpAndAccountsAndSessions = User & {
    groups: Group[],
    accounts: Account[],
    rsvp: (Rsvp & { event: Event })[],
    event: Event[],
    sessions: Session[],
}

export type userWithAccountsAndGroups = User & {
    groups: Group[],
    accounts: Account[],
}

export type enrollerStatisticsResponse = {
    provider: string;
    _count: {
        provider: number;
    };
};

export type miniUser = {
    id: string,
    name: string,
    email: string,
}

export type groupWithUser = {
    id: string,
    name: string,
    description: string,
    status: Status,
    users: User[],
    createdAt: Date,
    updatedAt: Date,
}

export type enrollerWithAuthorAndUser = {
    id: string,
    expires: Date
    userId: string,
    authorId: string,
    createdAt: Date,
    updatedAt: Date,
    user: User,
    author: User
}

export type enrollerResponse = {
    "id": string,
    "expires": string,
    "userId": string,
    "authorId":  string,
    "createdAt": string,
    "updatedAt": string,
    "author":{
        "name": string,
        "email": string,
        "image": string
    },
    "user": User
}

export type EventWithResponse = Event & {
    response: string,
    arrival: Date,
}

export type RsvpWithEvent = {
    "id": string,
    "createdAt": Date,
    "updatedAt": Date,
    "eventId": string,
    "response": string,
    "userId": string,
    "arrival": string,
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
    arrival: Date,
    User: User
}
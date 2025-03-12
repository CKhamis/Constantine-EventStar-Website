import z from "zod";

const EventType = z.enum([
    "PARTY",
    "HANGOUT",
    "GENERAL_EVENT",
    "CEREMONY",
    "MEETING",
    "CELEBRATION",
]);
const InviteVisibility = z.enum(["FULL", "INVITED_ONLY", "NONE",]);
const RsvpResponse = z.enum(["YES", "NO", "MAYBE"]);


export const editBasicUserInfoSchema = z.object({
    discordId: z.string().optional(),
    name: z.string().min(5, "First and last names expected"),
    phoneNumber: z.string().max(10, "Format should be: 5058425662").optional(),
});

export const emailSchema = z.object({
    email: z.string().email().max(255),
})

export const saveEventSchema = z.object({
    id: z.string().uuid().or(z.literal('')),
    title: z.string().min(1).max(255),
    backgroundStyle: z.string().min(1).max(255),
    address: z.string().max(255, "Address cannot exceed 255 characters").optional(),
    eventStart: z.date(),
    eventEnd: z.date(),
    rsvpDuedate: z.date().optional(),
    description: z.string().optional(),
    inviteVisibility: InviteVisibility,
    eventType: EventType,
    RSVP: z.array(
        z.string().cuid(),
    ).optional(),
})

export const followRequestReplySchema = z.object({
    senderId: z.string().cuid(),
    response: z.boolean()
})

export const uuidSchema = z.object({
    id: z.string().uuid()
})

export const rsvpSchema = z.object({
    response: RsvpResponse
})

export const cuidSchema = z.object({
    id: z.string().cuid()
})
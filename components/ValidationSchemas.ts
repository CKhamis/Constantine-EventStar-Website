import z from "zod";

// Enums
const UserRole = z.enum(["OWNER", "ADMIN", "USER"]);
const RsvpResponse = z.enum(["YES", "NO", "MAYBE"]);
const InviteRigidity = z.enum(["OPEN_INVITE", "ASK_HOST", "INVITE_ONLY"]);
const EventType = z.enum([
    "PARTY",
    "HANGOUT",
    "GENERAL_EVENT",
    "CEREMONY",
    "MEETING",
    "CELEBRATION",
]);
const ReminderAmount = z.enum(["OBSESSIVE", "PUSHY", "MEDIUM", "LIGHT", "ONCE", "NONE"]);

// Validation Schemas
export const uuidSchema = z.object({
    id: z.string().uuid()
})

export const cuidSchema = z.object({
    id: z.string().cuid()
})

export const rsvpSchema = z.object({
    guestId: z.string().uuid(),
    response: RsvpResponse
})

export const rsvpFormSchema = z.object({
    guestId: z.string().uuid(),
    eventId: z.string().uuid(),
    response: RsvpResponse
})

export const createUserSchema = z.object({
    firstName: z.string().min(1).max(255),
    lastName: z.string().max(255),
    phoneNumber: z.string().max(10, "Format should be: 5058425662"),
    email: z.string().email().max(255).optional().or(z.literal("")),
    discordId: z.string().max(255),
})

export const editUserSchema = z.object({
    id: z.string().cuid(),
    firstName: z.string().min(1).max(255),
    lastName: z.string().max(255),
    phoneNumber: z.string().max(10, "Format should be: 5058425662"),
    email: z.string().email().max(255).optional().or(z.literal("")),
    discordId: z.string().max(255),
})

export const createEventSchema = z.object({
    title: z.string().min(1).max(255),
    address: z.string().max(255, "Address cannot exceed 255 characters").optional(),
    eventStart: z.date(),
    eventEnd: z.date(),
    rsvpDuedate: z.date().optional(),
    description: z.string().optional(),
    inviteRigidity: InviteRigidity,
    eventType: EventType,
    reminderAmount: ReminderAmount,
    RSVP: z.array(
        z.string().cuid(),
    ).optional(),
    authorId: z.string().cuid()
})

export const editEventSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1).max(255),
    address: z.string().max(255, "Address cannot exceed 255 characters").optional(),
    eventStart: z.date(),
    eventEnd: z.date(),
    rsvpDuedate: z.date().optional(),
    description: z.string().optional(),
    inviteRigidity: InviteRigidity,
    eventType: EventType,
    reminderAmount: ReminderAmount,
    RSVP: z.array(
        z.string().cuid(),
    ).optional(),
    authorId: z.string().cuid()
})
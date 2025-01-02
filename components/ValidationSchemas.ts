import z from "zod";

// Enums
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
export const attendanceSchema = z.object({
    id: z.string(),
    pin: z.string(),
    moduleName: z.string(),
})


export const cardEnrollmentSchema = z.object({
    id: z.string().min(1).max(255),
    pin: z.string().regex(/^\d{4}$/),
})


export const uuidSchema = z.object({
    id: z.string().uuid()
})

export const cuidSchema = z.object({
    id: z.string().cuid()
})

export const rsvpSchema = z.object({
    response: RsvpResponse
})

export const rsvpArrivalSchema = z.object({
    id: z.string().cuid(),
    arrivalTime: z.date().optional(),
})

export const enrollmentSchema = z.object({
    enrollerId: z.string().cuid(),
    phoneNumber: z.string().max(10, "Format should be: 5058425662").optional(),
    email: z.string().email().max(255),
    discordId: z.string().max(255).optional(),
})

export const createUserSchema = z.object({
    name: z.string().min(1).max(255),
    phoneNumber: z.string().max(10, "Format should be: 5058425662"),
    email: z.string().email().max(255),
    discordId: z.string().max(255),
    pin: z.string().regex(/^\d{4}$/),
})

export const editUserSchema = z.object({
    id: z.string().cuid(),
    name: z.string().min(1).max(255),
    phoneNumber: z.string().max(10, "Format should be: 5058425662"),
    email: z.string().email().max(255),
    discordId: z.string().max(255),
    pin: z.string().regex(/^\d{4}$/)
})

export const profileEditUserSchema = z.object({
    id: z.string().cuid(),
    name: z.string().min(1).max(255),
    phoneNumber: z.string().max(10, "Format should be: 5058425662"),
    email: z.string().email().max(255),
    discordId: z.string().max(255),
})

export const createEventSchema = z.object({
    title: z.string().min(1).max(255),
    backgroundStyle: z.string().min(1).max(255),
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
    authorId: z.string().cuid(),
})

export const editEventSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1).max(255),
    backgroundStyle: z.string().min(1).max(255),
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
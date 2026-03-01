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
const RsvpResponseAll = z.enum(["YES", "NO", "MAYBE", "NO_RESPONSE"]);
const discordMergeDecision = z.enum(["HOST", "SECOND", "NEITHER"]);

export const esmtMergeFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email"),
	phone: z.string().optional(),
	discord: discordMergeDecision,
	hostId: z.string().cuid(),
	secondaryId: z.string().cuid(),
});

export const editBasicUserInfoSchema = z.object({
    name: z.string().min(5, "First and last names expected"),
    phoneNumber: z.string().max(10, "Format should be: 5058425662").optional(),
});

export const emailSchema = z.object({
    email: z.string().email().max(255),
})

export const verificationSchema = z.object({
    vn: z.string().min(4, "Invalid verification number").max(5, "Invalid verification number"),
});

export const notificationFrequencySchema = z.object({
    freq: z.coerce.number().min(0).max(3, "Invalid frequency number"),
});

export const discordUsernameSearch = z.object({
    username: z
        .string()
        .min(4)
        .max(255)
        .regex(/^[A-Za-z0-9._-]+$/, {
            message: "Username can only contain letters, numbers, ., _, and -",
        }),
})

export const discordUsernameSendVerification = z.object({
    id: z.string().min(5),
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
    maxGuests: z.coerce.number().int().min(0, "Must be a positive number"),
})

export const followRequestReplySchema = z.object({
    senderId: z.string().cuid(),
    response: z.boolean()
})

export const uuidSchema = z.object({
    id: z.string().uuid()
})

export const rsvpSchema = z.object({
    response: RsvpResponse,
    guests: z.coerce.number().int().min(0, "Must be a positive number").optional().or(z.literal(0)),
    firstName: z.string().max(20, "First name too long").min(1, "First name too short").optional().or(z.literal("")),
    lastName: z.string().max(20, "Last name too long").min(1, "Last name too short").optional().or(z.literal("")),
})

export const authorAddRsvpSchema = z.object({
    id: z.string().cuid().optional(), // user id
    response: RsvpResponseAll,
    guests: z.coerce.number().int().min(0, "Must be a positive number"),
    firstName: z.string().max(20, "First name too long").min(1, "First name too short").optional().or(z.literal("")),
    lastName: z.string().max(20, "Last name too long").min(1, "Last name too short").optional().or(z.literal("")),
})

export const authorChangeRsvpSchema = z.object({
    response: RsvpResponseAll,
    id: z.string().uuid(), // UUD of RSVP itself, not user
    guests: z.coerce.number().int().min(0, "Must be a positive number"),
    firstName: z.string().max(20, "First name too long").min(1, "First name too short").optional().or(z.literal("")),
    lastName: z.string().max(20, "Last name too long").min(1, "Last name too short").optional().or(z.literal("")),
})

export const cuidSchema = z.object({
    id: z.string().cuid()
})
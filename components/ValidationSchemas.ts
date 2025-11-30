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

export const esmtMergeFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email"),
	phone: z.string().optional(),
	discordId: z.string().optional(),

	hostId: z.string().cuid(),
	secondaryId: z.string().cuid(),
});

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

export const authorRsvpSchema = z.object({
    response: RsvpResponseAll,
    id: z.string().cuid()
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

export const editUserSchema = z.object({
    name: z.string().max(255),
    email: z.string().email().max(255),
    discordId: z.string().optional(),
    id: z.string().cuid(),
    phoneNumber: z.string().max(10).min(10).optional(),
})
import z from "zod";

export const uuidSchema = z.object({
    id: z.string().uuid()
})

export const createGuestSchema = z.object({
    firstName: z.string().min(1).max(255),
    lastName: z.string().max(255),
    phoneNumber: z.string().max(10, "Format should be: 5058425662"),
    email: z.string().email().max(255).optional().or(z.literal("")),
    discordId: z.string().max(255),
})

export const editGuestSchema = z.object({
    id: z.string().uuid(),
    firstName: z.string().min(1).max(255),
    lastName: z.string().max(255),
    phoneNumber: z.string().max(10, "Format should be: 5058425662"),
    email: z.string().email().max(255).optional().or(z.literal("")),
    discordId: z.string().max(255),
})

export const createEventSchema = z.object({

})
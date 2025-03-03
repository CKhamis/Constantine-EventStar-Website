import z from "zod";

export const editBasicUserInfoSchema = z.object({
    discordId: z.string().optional(),
    name: z.string().min(5, "First and last names expected"),
    phoneNumber: z.string().max(10, "Format should be: 5058425662").optional(),
})
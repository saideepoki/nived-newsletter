import {z} from "zod";

export const registerSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
})
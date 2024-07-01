import {z} from "zod";


export const usernameValidation = z.object({
    username: z.
    string().
    min(2,{message: "Username Must be atleast 2 characters"}).
    max(20, {message: "Username must be no more than 20 characters"}).
    regex(/^[a-zA-Z0-9_]+$/,{message: "Username must not contain any special character"})
})

export const registerSchema = z.object({
    username: z.
    string().
    min(2,{message: "Username Must be atleast 2 characters"}).
    max(20, {message: "Username must be no more than 20 characters"}).
    regex(/^[a-zA-Z0-9_]+$/,{message: "Username must not contain any special character"}),
    
    email: z.string().email({message: "Invalid email address"}),
    
    password: z.string().min(6,{message: "Password must be atleast 6 characters"})
})
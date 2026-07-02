import { z } from "zod";

export const phoneNumberSchema = z.object({
    phone_number: z.string().length(13, { message: 'Enter a valid phone number' })
})

export const otpSchema = z.object({
    otp: z.string().regex(/[a-zA-Z0-9]/, { message: 'Password must be alphanumeric' }),
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export const emailSchema = z.object({
    email: z.string().email(),
})

export const createPasswordSchema = z.object({
    verification_code: z.string().length(6, { message: 'Verification code must be 6 characters long' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirm_password: z.string()}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});

export const changePasswordSchema = z.object({
    old_password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    new_password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirm_password: z.string()}).refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});
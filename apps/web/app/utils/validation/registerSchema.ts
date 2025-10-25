import { RegoisterUserRequestSchema } from "@pawspot/api-contracts";
import z from "zod";

export const RegisterFormSchema = RegoisterUserRequestSchema.extend({
    confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
})

export type RegisterFormValues = z.infer<typeof RegisterFormSchema>;
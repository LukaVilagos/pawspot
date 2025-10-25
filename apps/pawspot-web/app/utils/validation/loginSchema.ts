import { LoginUserRequestSchema } from "@pawspot/api-contracts";
import type z from "zod";

export const LoginFormSchema = LoginUserRequestSchema;
export type LoginFormValues = z.infer<typeof LoginFormSchema>;
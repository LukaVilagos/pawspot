import { CreateUserRequestSchema, UpdateUserRequestSchema } from "@pawspot/api-contracts";
import type z from "zod";

export const EditUserSchema = UpdateUserRequestSchema;
export type EditUserValues = z.infer<typeof EditUserSchema>;

export const CreateUserSchema = CreateUserRequestSchema;
export type CreateUserValues = z.infer<typeof CreateUserSchema>;
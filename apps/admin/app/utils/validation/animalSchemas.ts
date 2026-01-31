import { CreateAnimalRequestSchema, UpdateAnimalRequestSchema } from "@pawspot/api-contracts";
import type z from "zod";

export const EditAnimalSchema = UpdateAnimalRequestSchema;
export type EditAnimalValues = z.infer<typeof EditAnimalSchema>;

export const CreateAnimalSchema = CreateAnimalRequestSchema;
export type CreateAnimalValues = z.infer<typeof CreateAnimalSchema>;

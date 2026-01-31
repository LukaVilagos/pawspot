import { CreateSanctuaryRequestSchema, UpdateSanctuaryRequestSchema } from "@pawspot/api-contracts";
import type z from "zod";

export const EditSanctuarySchema = UpdateSanctuaryRequestSchema;
export type EditSanctuaryValues = z.infer<typeof EditSanctuarySchema>;

export const CreateSanctuarySchema = CreateSanctuaryRequestSchema;
export type CreateSanctuaryValues = z.infer<typeof CreateSanctuarySchema>;

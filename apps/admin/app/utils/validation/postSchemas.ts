import { CreatePostRequestSchema, UpdatePostRequestSchema } from "@pawspot/api-contracts";
import type z from "zod";

export const EditPostSchema = UpdatePostRequestSchema;
export type EditPostValues = z.infer<typeof EditPostSchema>;

export const CreatePostSchema = CreatePostRequestSchema;
export type CreatePostValues = z.infer<typeof CreatePostSchema>;

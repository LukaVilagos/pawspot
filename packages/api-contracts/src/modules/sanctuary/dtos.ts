import z from "zod";
import { UserSummarySchema } from "../user";
import { createZodDto } from "nestjs-zod";
import { PaginatedResponseSchema } from "../../shared";

export const CreateSanctuaryRequestSchema = z.strictObject({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
  ownerId: z.string().optional(),
  contributors: z.array(z.string()).optional(),
});

export const UpdateSanctuaryRequestSchema = z.strictObject({
  name: z.string().min(1, 'Name cannot be empty').optional(),
  location: z.string().min(1, 'Location cannot be empty').optional(),
  ownerId: z.string().optional(),
  contributors: z.array(z.string()).optional(),
});

export const ContributorRequestSchema = z.strictObject({
  userId: z.string().min(1, 'User ID is required'),
});

export const SanctuaryAnimalSummarySchema = z.strictObject({
  id: z.string(),
  name: z.string(),
  species: z.string(),
});

export const SanctuaryPostSummarySchema = z.strictObject({
  id: z.string(),
  title: z.string(),
});

export const SanctuaryResponseSchema = z.strictObject({
  id: z.string(),
  createdAt: z.coerce.date(),
  name: z.string(),
  location: z.string(),
  get owner(): z.ZodNullable<typeof UserSummarySchema> {
    return z.nullable(UserSummarySchema);
  },
  get contributors(): z.ZodArray<typeof UserSummarySchema> {
    return z.array(UserSummarySchema);
  },
  get animals(): z.ZodArray<typeof SanctuaryAnimalSummarySchema> {
    return z.array(SanctuaryAnimalSummarySchema);
  },
  get posts(): z.ZodArray<typeof SanctuaryPostSummarySchema> {
    return z.array(SanctuaryPostSummarySchema);
  }
});

export const SanctuarySummarySchema = SanctuaryResponseSchema.pick({
  id: true,
  name: true,
  location: true,
});

export const SanctuariesListResponseSchema = z.array(SanctuaryResponseSchema);
export const PaginatedSanctuaryResponseSchema = PaginatedResponseSchema(SanctuaryResponseSchema);

export type SanctuaryResponse = z.infer<typeof SanctuaryResponseSchema>;
export type SanctuariesListResponse = z.infer<
  typeof SanctuariesListResponseSchema
>;
export type SanctuarySummary = z.infer<typeof SanctuarySummarySchema>;
export type CreateSanctuaryRequest = z.infer<
  typeof CreateSanctuaryRequestSchema
>;
export type UpdateSanctuaryRequest = z.infer<
  typeof UpdateSanctuaryRequestSchema
>;
export type PaginatedSanctuaryResponse = z.infer<typeof PaginatedSanctuaryResponseSchema>;
export type ContributorRequest = z.infer<typeof ContributorRequestSchema>;

export class ContributorRequestDto extends createZodDto(
  ContributorRequestSchema
) { }
export class SanctuaryResponseDto extends createZodDto(
  SanctuaryResponseSchema
) { }
export class SanctuariesListResponseDto extends createZodDto(
  SanctuariesListResponseSchema
) { }
export class CreateSanctuaryRequestDto extends createZodDto(
  CreateSanctuaryRequestSchema
) { }
export class UpdateSanctuaryRequestDto extends createZodDto(
  UpdateSanctuaryRequestSchema
) { }
export class PaginatedSanctuaryResponseDto extends createZodDto(
  PaginatedSanctuaryResponseSchema
) { }
export class SanctuarySummaryDto extends createZodDto(
  SanctuarySummarySchema
) { }

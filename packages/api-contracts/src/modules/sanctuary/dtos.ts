import z from "zod";
import { UserSummarySchema } from "../user";
import { createZodDto } from "nestjs-zod";
import { PaginatedResponseSchema } from "../..";

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

export const CreateSanctuaryRequestSchema = z.object({
  name: z.string(),
  location: z.string(),
  ownerId: z.string().optional(),
  contributors: z.array(z.string()).optional(),
});

export const UpdateSanctuaryRequestSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  ownerId: z.string().optional(),
  contributors: z.array(z.string()).optional(),
});

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

export const SanctuaryResponseSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  name: z.string(),
  location: z.string(),
  owner: UserSummarySchema,
  contributors: z.array(UserSummarySchema),
});

export const SanctuarySummarySchema = SanctuaryResponseSchema.pick({
  id: true,
  name: true,
  location: true,
});

export const SanctuariesListResponseSchema = z.array(SanctuaryResponseSchema);
export const PaginatedSanctuaryResponseSchema = PaginatedResponseSchema(SanctuaryResponseSchema);

// ============================================================================
// TYPE EXPORTS
// ============================================================================

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

// ============================================================================
// DTO EXPORTS (for NestJS)
// ============================================================================

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

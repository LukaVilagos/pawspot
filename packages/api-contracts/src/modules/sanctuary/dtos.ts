import z from "zod";
import { UserResponseSchema } from "../user";
import { createZodDto } from "nestjs-zod";

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

export const CreateSanctuaryRequestSchema = z.object({
  name: z.string(),
  location: z.string(),
});

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

export const SanctuaryResponseSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  name: z.string(),
  location: z.string(),
  owner: UserResponseSchema,
});

export const SanctuariesListResponseSchema = z.array(SanctuaryResponseSchema);

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type SanctuaryResponse = z.infer<typeof SanctuaryResponseSchema>;
export type SanctuariesListResponse = z.infer<
  typeof SanctuariesListResponseSchema
>;

// ============================================================================
// DTO EXPORTS (for NestJS)
// ============================================================================

export class SanctuaryResponseDto extends createZodDto(
  SanctuaryResponseSchema
) {}
export class SanctuariesListResponseDto extends createZodDto(
  SanctuariesListResponseSchema
) {}
export class CreateSanctuaryRequestDto extends createZodDto(
  CreateSanctuaryRequestSchema
) {}

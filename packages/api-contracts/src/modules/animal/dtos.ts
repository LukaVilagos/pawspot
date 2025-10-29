import { z } from "zod";
import { createZodDto } from "nestjs-zod";

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

export const CreateAnimalRequestSchema = z.object({
    name: z.string().min(1),
    species: z.string().min(1),
    age: z.number().int().min(0),
    sanctuaryId: z.string().min(1),
});

export const UpdateAnimalRequestSchema = z.object({
    name: z.string().min(1).optional(),
    species: z.string().min(1).optional(),
    age: z.number().int().min(0).optional(),
    sanctuaryId: z.string().min(1).optional(),
});

// ============================================================================

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

export const AnimalResponseSchema = z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
    name: z.string(),
    species: z.string(),
    age: z.number().int(),
    sanctuaryId: z.string(),
});

export const AnimalsListResponseSchema = z.array(AnimalResponseSchema);

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type AnimalResponse = z.infer<typeof AnimalResponseSchema>;
export type AnimalsListResponse = z.infer<typeof AnimalsListResponseSchema>;
export type CreateAnimalRequest = z.infer<typeof CreateAnimalRequestSchema>;
export type UpdateAnimalRequest = z.infer<typeof UpdateAnimalRequestSchema>;

// ============================================================================
// DTO EXPORTS (for NestJS)
// ============================================================================

export class AnimalResponseDto extends createZodDto(AnimalResponseSchema) { }
export class AnimalsListResponseDto extends createZodDto(
    AnimalsListResponseSchema
) { }
export class CreateAnimalRequestDto extends createZodDto(
    CreateAnimalRequestSchema
) { }
export class UpdateAnimalRequestDto extends createZodDto(
    UpdateAnimalRequestSchema
) { }

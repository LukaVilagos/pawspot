import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import { PaginatedResponseSchema } from "../../shared";
import { SanctuarySummarySchema } from "../sanctuary";

export const CreateAnimalRequestSchema = z.strictObject({
    name: z.string().min(1, 'Name is required'),
    species: z.string().min(1, 'Species is required'),
    age: z.coerce.number().int('Age must be a whole number').min(0, 'Age cannot be negative'),
    sanctuaryId: z.string().min(1, 'Sanctuary is required'),
});

export const UpdateAnimalRequestSchema = z.strictObject({
    name: z.string().min(1, 'Name cannot be empty').optional(),
    species: z.string().min(1, 'Species cannot be empty').optional(),
    age: z.coerce.number().int('Age must be a whole number').min(0, 'Age cannot be negative').optional(),
    sanctuaryId: z.string().min(1, 'Sanctuary cannot be empty').optional(),
});

export const AnimalResponseSchema = z.strictObject({
    id: z.string(),
    createdAt: z.coerce.date(),
    name: z.string(),
    species: z.string(),
    age: z.number().int(),
    get sanctuary(): typeof SanctuarySummarySchema {
        return SanctuarySummarySchema;
    }
});

export const AnimalSummarySchema = AnimalResponseSchema.pick({
    id: true,
    name: true,
    species: true,
});

export const AnimalsListResponseSchema = z.array(AnimalResponseSchema);
export const PaginatedAnimalResponseSchema = PaginatedResponseSchema(AnimalResponseSchema);

export type AnimalResponse = z.infer<typeof AnimalResponseSchema>;
export type AnimalSummary = z.infer<typeof AnimalSummarySchema>;
export type AnimalsListResponse = z.infer<typeof AnimalsListResponseSchema>;
export type CreateAnimalRequest = z.infer<typeof CreateAnimalRequestSchema>;
export type UpdateAnimalRequest = z.infer<typeof UpdateAnimalRequestSchema>;
export type PaginatedAnimalResponse = z.infer<typeof PaginatedAnimalResponseSchema>;

export class AnimalResponseDto extends createZodDto(AnimalResponseSchema) { }
export class AnimalSummaryDto extends createZodDto(AnimalSummarySchema) { }
export class AnimalsListResponseDto extends createZodDto(AnimalsListResponseSchema) { }
export class CreateAnimalRequestDto extends createZodDto(CreateAnimalRequestSchema) { }
export class UpdateAnimalRequestDto extends createZodDto(UpdateAnimalRequestSchema) { }
export class PaginatedAnimalResponseDto extends createZodDto(PaginatedAnimalResponseSchema) { }

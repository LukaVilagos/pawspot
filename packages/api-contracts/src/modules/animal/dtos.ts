import { z } from "zod";
import { createZodDto } from "nestjs-zod";

export const CreateAnimalRequestSchema = z.strictObject({
    name: z.string().min(1, 'Name is required'),
    species: z.string().min(1, 'Species is required'),
    age: z.number().int('Age must be a whole number').min(0, 'Age cannot be negative'),
    sanctuaryId: z.string().min(1, 'Sanctuary is required'),
});

export const UpdateAnimalRequestSchema = z.strictObject({
    name: z.string().min(1, 'Name cannot be empty').optional(),
    species: z.string().min(1, 'Species cannot be empty').optional(),
    age: z.number().int('Age must be a whole number').min(0, 'Age cannot be negative').optional(),
    sanctuaryId: z.string().min(1, 'Sanctuary cannot be empty').optional(),
});

export const AnimalResponseSchema = z.strictObject({
    id: z.string(),
    createdAt: z.coerce.date(),
    name: z.string(),
    species: z.string(),
    age: z.number().int(),
    sanctuaryId: z.string(),
});

export const AnimalsListResponseSchema = z.array(AnimalResponseSchema);

export type AnimalResponse = z.infer<typeof AnimalResponseSchema>;
export type AnimalsListResponse = z.infer<typeof AnimalsListResponseSchema>;
export type CreateAnimalRequest = z.infer<typeof CreateAnimalRequestSchema>;
export type UpdateAnimalRequest = z.infer<typeof UpdateAnimalRequestSchema>;

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

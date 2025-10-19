import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

export const CreateUserRequestSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
    name: z.string().nullable(),
});

// ============================================================================

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

export const UserResponseSchema = z.object({
    id: z.string(),
    email: z.email(),
    name: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const UsersListResponseSchema = z.array(UserResponseSchema);

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

// ============================================================================
// DTO EXPORTS (for NestJS)
// ============================================================================

export class UserResponseDto extends createZodDto(UserResponseSchema) { }
export class UsersListResponseDto extends createZodDto(UsersListResponseSchema) { }
export class CreateUserRequestDto extends createZodDto(CreateUserRequestSchema) { }
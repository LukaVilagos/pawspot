import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import { PaginatedResponseSchema } from "../../shared";

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

export const UserTypeSchema = z.enum(['ADMIN', 'USER']);

export const CreateUserRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().nullable(),
  type: UserTypeSchema.optional(),
});

export const UpdateUserRequestSchema = z.object({
  email: z.email().optional(),
  name: z.string().nullable().optional(),
  type: UserTypeSchema.optional(),
});

// ============================================================================

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

export const UserResponseSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  email: z.email(),
  name: z.string().nullable(),
  type: z.enum(['ADMIN', 'USER']),
});

export const PaginatedUserResponseSchema = PaginatedResponseSchema(UserResponseSchema);
export const UsersListResponseSchema = z.array(UserResponseSchema);

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;

// ============================================================================
// DTO EXPORTS (for NestJS)
// ============================================================================

export class UserResponseDto extends createZodDto(UserResponseSchema) { }
export class UsersListResponseDto extends createZodDto(
  UsersListResponseSchema
) { }
export class CreateUserRequestDto extends createZodDto(
  CreateUserRequestSchema
) { }
export class UpdateUserRequestDto extends createZodDto(
  UpdateUserRequestSchema
) { }
export class PaginatedUserResponseDto extends createZodDto(
  PaginatedUserResponseSchema
) { }

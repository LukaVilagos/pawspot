import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import { PaginatedResponseSchema } from "../../shared";
import { SanctuarySummarySchema } from "../sanctuary";

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
// RESPONSE SCHEMAS
// ============================================================================

export const UserResponseSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  email: z.email(),
  name: z.string().nullable(),
  type: UserTypeSchema,
  sanctuaries: () => z.array(SanctuarySummarySchema),
  followedSanctuaries: () => z.array(SanctuarySummarySchema),
});

export const UserSummarySchema = UserResponseSchema.pick({
  id: true,
  email: true,
  name: true,
});

export const SignedUserSchema = UserResponseSchema.pick({
  id: true,
  email: true,
  type: true,
})

export const AuthUserSchema = SignedUserSchema.pick({
  id: true,
  createdAt: true,
  name: true,
  email: true,
  type: true,
});

export const PaginatedUserResponseSchema = PaginatedResponseSchema(UserResponseSchema);
export const UsersListResponseSchema = z.array(UserResponseSchema);

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type UserType = z.infer<typeof UserTypeSchema>;
export type UserSummary = z.infer<typeof UserSummarySchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
export type PaginatedUserResponse = z.infer<typeof PaginatedUserResponseSchema>;
export type SignedUser = z.infer<typeof SignedUserSchema>;
export type AuthUser = z.infer<typeof AuthUserSchema>;

// ============================================================================
// DTO EXPORTS (for NestJS)
// ============================================================================

export class UserSummaryDto extends createZodDto(UserSummarySchema) { }
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
export class SignedUserDto extends createZodDto(
  SignedUserSchema
) { }
export class AuthUserDto extends createZodDto(
  AuthUserSchema
) { }

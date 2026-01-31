import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import { PaginatedResponseSchema } from "../../shared";
import { SanctuarySummarySchema } from "../sanctuary";

export const UserTypeSchema = z.enum(['ADMIN', 'USER']);

export const CreateUserRequestSchema = z.strictObject({
  email: z.string('Email is required').min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string('Password is required').min(6, 'Password must be at least 6 characters'),
  name: z.string('Name is required').nullable(),
  type: UserTypeSchema.optional(),
});

export const UpdateUserRequestSchema = z.strictObject({
  email: z.string().email('Please enter a valid email address').optional(),
  name: z.string().nullable().optional(),
  type: UserTypeSchema.optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

export const AdminUpdateUserRequestSchema = z.strictObject({
  email: z.string().email('Please enter a valid email address').optional(),
  name: z.string().nullable().optional(),
  type: UserTypeSchema.optional(),
});

export const UserResponseSchema = z.strictObject({
  id: z.string(),
  createdAt: z.coerce.date(),
  email: z.string().email(),
  name: z.string().nullable(),
  type: UserTypeSchema,
  get sanctuaries(): z.ZodNullable<z.ZodArray<typeof SanctuarySummarySchema>> {
    return z.nullable(z.array(SanctuarySummarySchema));
  },
  get followedSanctuaries(): z.ZodArray<typeof SanctuarySummarySchema> {
    return z.array(SanctuarySummarySchema);
  }
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
}).passthrough()

export const AuthUserSchema = UserResponseSchema.pick({
  id: true,
  createdAt: true,
  name: true,
  email: true,
  type: true,
});

export const PaginatedUserResponseSchema = PaginatedResponseSchema(UserResponseSchema);
export const PaginatedUserSummaryResponseSchema = PaginatedResponseSchema(UserSummarySchema);
export const UsersListResponseSchema = z.array(UserResponseSchema);

export type UserType = z.infer<typeof UserTypeSchema>;
export type UserSummary = z.infer<typeof UserSummarySchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
export type AdminUpdateUserRequest = z.infer<typeof AdminUpdateUserRequestSchema>;
export type PaginatedUserResponse = z.infer<typeof PaginatedUserResponseSchema>;
export type PaginatedUserSummaryResponse = z.infer<typeof PaginatedUserSummaryResponseSchema>;
export type SignedUser = z.infer<typeof SignedUserSchema>;
export type AuthUser = z.infer<typeof AuthUserSchema>;

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
export class AdminUpdateUserRequestDto extends createZodDto(
  AdminUpdateUserRequestSchema
) { }
export class PaginatedUserResponseDto extends createZodDto(
  PaginatedUserResponseSchema
) { }
export class PaginatedUserSummaryResponseDto extends createZodDto(
  PaginatedUserSummaryResponseSchema
) { }
export class SignedUserDto extends createZodDto(
  SignedUserSchema
) { }
export class AuthUserDto extends createZodDto(
  AuthUserSchema
) { }

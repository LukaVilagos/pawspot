import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import { UserResponseSchema } from "../user";

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

export const RegoisterUserRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string(),
});

export const LoginUserRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

// ============================================================================

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

export const AccessTokenResponseSchema = z.object({
  access_token: z.string(),
});

export const LoginResponseSchema = z.object({
  ...AccessTokenResponseSchema.shape,
  user: UserResponseSchema,
});

export const RegisterResponseSchema = z.object({
  ...AccessTokenResponseSchema.shape,
  user: UserResponseSchema,
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type RegisterUserRequest = z.infer<typeof RegoisterUserRequestSchema>;
export type LoginUserRequest = z.infer<typeof LoginUserRequestSchema>;
export type AccessTokenResponse = z.infer<typeof AccessTokenResponseSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;

// ============================================================================
// DTO EXPORTS (for NestJS)
// ============================================================================

export class RegisterRequestDto extends createZodDto(
  RegoisterUserRequestSchema
) {}
export class AccessTokenResponseDto extends createZodDto(
  AccessTokenResponseSchema
) {}
export class LoginResponseDto extends createZodDto(LoginResponseSchema) {}
export class RegisterResponseDto extends createZodDto(RegisterResponseSchema) {}

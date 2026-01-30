import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import { AuthUserSchema } from "../user";

export const RegisterUserRequestSchema = z.strictObject({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
});

export const LoginUserRequestSchema = z.strictObject({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const AccessTokenResponseSchema = z.strictObject({
  access_token: z.string(),
});

export const LoginResponseSchema = z.strictObject({
  ...AccessTokenResponseSchema.shape,
  get user(): typeof AuthUserSchema {
    return AuthUserSchema;
  }
});

export const RegisterResponseSchema = z.strictObject({
  ...AccessTokenResponseSchema.shape,
  get user(): typeof AuthUserSchema {
    return AuthUserSchema;
  }
});

export type RegisterUserRequest = z.infer<typeof RegisterUserRequestSchema>;
export type LoginUserRequest = z.infer<typeof LoginUserRequestSchema>;
export type AccessTokenResponse = z.infer<typeof AccessTokenResponseSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;

export class RegisterRequestDto extends createZodDto(
  RegisterUserRequestSchema
) { }
export class AccessTokenResponseDto extends createZodDto(
  AccessTokenResponseSchema
) { }
export class LoginResponseDto extends createZodDto(LoginResponseSchema) { }
export class RegisterResponseDto extends createZodDto(RegisterResponseSchema) { }

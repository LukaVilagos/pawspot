import { LoginResponseDto, RegisterResponseDto } from "./dtos";
import { AUTH_ROUTES } from "./routes";

export const AuthContract = {
    login: {
        method: 'POST' as const,
        route: AUTH_ROUTES.LOGIN,
        response: {} as LoginResponseDto,
    },
    register: {
        method: 'POST' as const,
        route: AUTH_ROUTES.REGISTER,
        response: {} as RegisterResponseDto,
    },
} as const;


export type AuthContractType = typeof AuthContract;
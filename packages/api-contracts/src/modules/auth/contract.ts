import { LoginResponseDto, LoginUserRequest, RegisterResponseDto, RegisterUserRequest } from "./dtos";
import { AUTH_ROUTES } from "./routes";

export const AuthContract = {
    root: {
        method: 'GET' as const,
        route: AUTH_ROUTES.ROOT,
    },
    login: {
        method: 'POST' as const,
        route: AUTH_ROUTES.LOGIN,
        build: () => `${AUTH_ROUTES.ROOT}/${AUTH_ROUTES.LOGIN}`,
        request: {} as LoginUserRequest,
        response: {} as LoginResponseDto,
    },
    adminLogin: {
        method: 'POST' as const,
        route: AUTH_ROUTES.ADMIN_LOGIN,
        build: () => `${AUTH_ROUTES.ROOT}/${AUTH_ROUTES.ADMIN_LOGIN}`,
        request: {} as LoginUserRequest,
        response: {} as LoginResponseDto,
    },
    register: {
        method: 'POST' as const,
        route: AUTH_ROUTES.REGISTER,
        build: () => `${AUTH_ROUTES.ROOT}/${AUTH_ROUTES.REGISTER}`,
        request: {} as RegisterUserRequest,
        response: {} as RegisterResponseDto,
    },
} as const;


export type AuthContractType = typeof AuthContract;
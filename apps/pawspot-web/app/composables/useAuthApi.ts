import type { LoginResponse, LoginUserRequest, RegisterResponse, RegisterUserRequest } from "@pawspot/api-contracts";

export const useAuthApi = () => {
    const login = async (credentials: LoginUserRequest): Promise<LoginResponse> => {
        return await $fetch<LoginResponse>('/api/auth/login', {
            method: 'POST',
            body: credentials,
        });
    };
    const register = async (userData: RegisterUserRequest): Promise<RegisterResponse> => {
        return await $fetch<RegisterResponse>('/api/auth/register', {
            method: 'POST',
            body: userData,
        });
    };

    return {
        login,
        register,
    };
}
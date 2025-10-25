import type { LoginResponse, LoginUserRequest, RegisterUserRequest } from "@pawspot/api-contracts";
import { useAuthApi } from "~/composables/useAuthApi";

export const useAuthStore = defineStore('auth', () => {
    const isAuthenticated = ref<boolean>(false);
    const authToken = ref<LoginResponse["access_token"] | null>(null);
    const authUser = ref<LoginResponse["user"] | null>(null);
    const error = ref<string | null>(null);
    const loading = ref<boolean>(false);

    const { login, register } = useAuthApi();

    const handleLogin = async (credentials: LoginUserRequest) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await login(credentials);
            authToken.value = response.access_token;
            authUser.value = response.user;
            isAuthenticated.value = true;
        } catch (e) {
            error.value = 'Login failed';
        } finally {
            loading.value = false;
        }
    };

    const handleLogout = async () => {
        loading.value = true;
        error.value = null;
        try {
            authToken.value = null;
            authUser.value = null;
            isAuthenticated.value = false;
        } catch (e) {
            error.value = 'Logout failed';
        } finally {
            loading.value = false;
        }
    };

    const handleRegister = async (userData: RegisterUserRequest) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await register(userData);
            authToken.value = response.access_token;
            authUser.value = response.user;
            isAuthenticated.value = true;
        } catch (e) {
            error.value = 'Registration failed';
        } finally {
            loading.value = false;
        }
    };

    return {
        isAuthenticated,
        authToken,
        authUser,
        error,
        loading,
        handleLogin,
        handleLogout,
        handleRegister
    };
}, {
    persist: true,
});
import type {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from "@pawspot/api-contracts";
import type { Ref } from "vue";

export const useAuth = () => {
  const {
    loggedIn,
    user: rawUser,
    session,
    fetch: refreshSession,
  } = useUserSession() as {
    loggedIn: Ref<boolean>;
    user: Ref<UserResponse | null>;
    session: Ref<{ access_token?: string } | null>;
    fetch: () => Promise<void>;
  };

  const user = rawUser as Ref<UserResponse | null>;
  const token = computed(() => session.value?.access_token ?? null);

  const login = async (credentials: LoginUserRequest) => {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: credentials,
    });
    await refreshSession();
    await navigateTo("/");
  };

  const loginAdmin = async (credentials: LoginUserRequest) => {
    await $fetch("/api/auth/admin/login", {
      method: "POST",
      body: credentials,
    });
    await refreshSession();
    await navigateTo("/");
  }

  const register = async (payload: RegisterUserRequest) => {
    await $fetch("/api/auth/register", {
      method: "POST",
      body: payload,
    });
    await refreshSession();
    await navigateTo("/");
  };

  const logout = async () => {
    await $fetch("/api/auth/logout", { method: "POST" });
    await refreshSession();
    await navigateTo("/login");
  };

  return {
    loggedIn,
    user,
    token,
    login,
    loginAdmin,
    register,
    logout,
    refreshSession,
  };
};

export default useAuth;

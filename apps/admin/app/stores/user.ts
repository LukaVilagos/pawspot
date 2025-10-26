import type {
    UserResponse,
    UsersListResponse,
    CreateUserRequest,
    UpdateUserRequest,
    QueryOptions,
    PaginatedResponse,
} from "@pawspot/api-contracts";

export const useUserStore = defineStore("user", () => {
    const users = ref<UsersListResponse>([]);
    const user = ref<UserResponse | null>(null);
    const searchResult = ref<PaginatedResponse<UserResponse> | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    function setUsers(newUsers: UsersListResponse) {
        users.value = newUsers;
    }

    function setUser(newUser: UserResponse | null) {
        user.value = newUser;
    }

    function setSearchResult(newResult: PaginatedResponse<UserResponse> | null) {
        searchResult.value = newResult;
    }

    async function fetchUserById(id: string) {
        isLoading.value = true;
        error.value = null;
        try {
            const api = useUserApi();
            const res = await api.getUserById(id);
            const data = res?.data?.value;
            setUser(data ?? null);
            return data ?? null;
        } catch (e: any) {
            error.value = e?.message ?? String(e);
            return null;
        } finally {
            isLoading.value = false;
        }
    }

    async function createUser(payload: CreateUserRequest) {
        isLoading.value = true;
        error.value = null;
        try {
            const api = useUserApi();
            const res = await api.createUser(payload);
            const data = res?.data?.value;
            if (data) {
                users.value = [data, ...users.value];
            }
            return data ?? null;
        } catch (e: any) {
            error.value = e?.message ?? String(e);
            return null;
        } finally {
            isLoading.value = false;
        }
    }

    async function updateUser(id: string, payload: UpdateUserRequest) {
        isLoading.value = true;
        error.value = null;
        try {
            const api = useUserApi();
            const res = await api.updateUser(id, payload);
            const data = res?.data?.value;
            if (data) {
                users.value = users.value.map((u) => (u.id === data.id ? data : u));
                if (user.value?.id === data.id) user.value = data;
            }
            return data ?? null;
        } catch (e: any) {
            error.value = e?.message ?? String(e);
            return null;
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteUser(id: string) {
        isLoading.value = true;
        error.value = null;
        try {
            const api = useUserApi();
            await api.deleteUser(id);
            users.value = users.value.filter((u) => u.id !== id);
            if (user.value?.id === id) user.value = null;
            return true;
        } catch (e: any) {
            error.value = e?.message ?? String(e);
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    async function searchUsers(query: QueryOptions<UserResponse>) {
        isLoading.value = true;
        error.value = null;
        try {
            const api = useUserApi();
            const res = await api.searchUsers(query);
            const data = res?.data?.value ?? null;
            setSearchResult(data);
            setUsers(data?.items ?? []);
            return data;
        } catch (e: any) {
            error.value = e?.message ?? String(e);
            return null;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        isLoading,
        error,
        users,
        user,
        searchResult,
        setUsers,
        setUser,
        setSearchResult,
        fetchUserById,
        createUser,
        updateUser,
        deleteUser,
        searchUsers,
    };
});
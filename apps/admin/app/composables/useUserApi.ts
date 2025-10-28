import type {
    UserResponse,
    CreateUserRequest,
    UpdateUserRequest,
    PaginatedResponse,
    QueryOptions,
} from "@pawspot/api-contracts";

export const useUserApi = () => {
    const getUserById = async (id: string) => {
        return await useFetch<UserResponse>(`/api/user/${id}`);
    };

    const createUser = async (payload: CreateUserRequest) => {
        return await useFetch<UserResponse>("/api/user", {
            method: "POST",
            body: payload,
        });
    };

    const updateUser = async (id: string, payload: UpdateUserRequest) => {
        return await useFetch<UserResponse>(`/api/user/${id}`, {
            method: "PUT",
            body: payload,
        });
    };

    const deleteUser = async (id: string) => {
        return await useFetch<{ message: string }>(`/api/user/${id}`, {
            method: "DELETE",
        });
    };

    const searchUsers = async (query: QueryOptions<UserResponse>) => {
        return await $fetch<PaginatedResponse<UserResponse>>(
            "/api/user/search",
            {
                method: "POST",
                body: query,
            }
        );
    };

    return {
        getUserById,
        createUser,
        updateUser,
        deleteUser,
        searchUsers,
    };
};
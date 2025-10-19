import { type UserResponse, type UsersListResponse, type UsersListResponseDto } from "@pawspot/api-contracts";

export const useUserApi = () => {
    const getAllUsers = async (): Promise<UsersListResponse> => {
        return await $fetch<UsersListResponseDto>('/api/user');
    }

    const getUserById = async (id: string): Promise<UserResponse> => {
        return await $fetch<UserResponse>(`/api/user/${id}`);
    }

    return {
        getAllUsers,
        getUserById,
    };
};
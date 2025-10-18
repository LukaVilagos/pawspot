import { type UserResponseDto, type UsersListResponseDto } from "@pawspot/api-contracts";

export const useUserApi = () => {
    const getAllUsers = async (): Promise<UsersListResponseDto> => {
        return await $fetch<UsersListResponseDto>('/api/user');
    }

    const getUserById = async (id: string): Promise<UserResponseDto | null> => {
        return await $fetch<UserResponseDto | null>(`/api/user/${id}`);
    }

    return {
        getAllUsers,
        getUserById,
    };
};
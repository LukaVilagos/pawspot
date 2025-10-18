import { type UsersListResponseDto } from "@pawspot/api-contracts";

export const useUserApi = () => {
    const getAllUsers = async (): Promise<UsersListResponseDto> => {
        return await $fetch<UsersListResponseDto>('/api/user');
    }

    return {
        getAllUsers,
    };
};
import type { UserResponse, UsersListResponse } from "@pawspot/api-contracts";

export const useUserApi = () => {
  const getAllUsers = async () => {
    return await useFetch<UsersListResponse>("/api/user");
  };

  const getUserById = async (id: string) => {
    return await useFetch<UserResponse>(`/api/user/${id}`);
  };

  return {
    getAllUsers,
    getUserById,
  };
};

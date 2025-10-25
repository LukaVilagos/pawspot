import type { UsersListResponse } from "@pawspot/api-contracts";
import { UserContract } from "@pawspot/api-contracts";

export default defineEventHandler(async (): Promise<UsersListResponse> => {
  return await $fetch(UserContract.getAll.route, {
    method: UserContract.getAll.method,
    baseURL: useRuntimeConfig().public.apiUrl,
  });
});

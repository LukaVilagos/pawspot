import { UserContract, type UsersListResponseDto } from '@pawspot/api-contracts';

export default defineEventHandler(async (): Promise<UsersListResponseDto> => {
    return await $fetch(UserContract.getAll.route, {
        method: UserContract.getAll.method,
        baseURL: useRuntimeConfig().public.apiUrl,
    });
});
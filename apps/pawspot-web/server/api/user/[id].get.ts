import { UserContract, UserResponse } from "@pawspot/api-contracts"

export default defineEventHandler(async (event): Promise<UserResponse> => {
    const id = event.context.params?.id;

    if (!id) {
        throw new Error('User ID is required');
    }

    type GetByIdParams = typeof UserContract.getById.params;
    const params: GetByIdParams = { id };

    return await $fetch(UserContract.getById.build(params), {
        method: UserContract.getById.method,
        baseURL: useRuntimeConfig().public.apiUrl,
    });
})
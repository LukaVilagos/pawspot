import { AuthContract, LoginResponse } from '@pawspot/api-contracts';

export default defineEventHandler(async (event): Promise<LoginResponse> => {
    type BodyType = typeof AuthContract.login.request;
    const body: BodyType = await readBody(event);

    return await $fetch(AuthContract.login.build(), {
        method: AuthContract.login.method,
        body,
        baseURL: useRuntimeConfig().public.apiUrl,
    });
});

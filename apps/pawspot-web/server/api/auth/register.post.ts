import { AuthContract, RegisterResponse } from '@pawspot/api-contracts';

export default defineEventHandler(async (event): Promise<RegisterResponse> => {
    type BodyType = typeof AuthContract.register.request;
    const body: BodyType = await readBody(event);

    return await $fetch(AuthContract.register.build(), {
        method: AuthContract.register.method,
        body,
        baseURL: useRuntimeConfig().public.apiUrl,
    });
});

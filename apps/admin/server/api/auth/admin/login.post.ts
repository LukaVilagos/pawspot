import { AdminAuthContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof AdminAuthContract.login.response> => {
        type BodyType = typeof AdminAuthContract.login.request;
        const body: BodyType = await readBody(event);

        const response = await publicServerFetch<
            typeof AdminAuthContract.login.response
        >(event, AdminAuthContract.login.build(), {
            method: AdminAuthContract.login.method,
            body,
        });

        await setUserSession(event, {
            user: response?.user,
            access_token: response?.access_token,
        });

        return response;
    }
);

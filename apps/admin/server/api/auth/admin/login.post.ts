import { AuthContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof AuthContract.adminLogin.response> => {
        type BodyType = typeof AuthContract.adminLogin.request;
        const body: BodyType = await readBody(event);

        const response = await publicServerFetch<
            typeof AuthContract.adminLogin.response
        >(event, AuthContract.adminLogin.build(), {
            method: AuthContract.adminLogin.method,
            body,
        });

        await setUserSession(event, {
            user: response?.user,
            access_token: response?.access_token,
        });

        return response;
    }
);

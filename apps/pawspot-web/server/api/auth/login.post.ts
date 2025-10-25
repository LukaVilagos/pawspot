import { AuthContract } from "@pawspot/api-contracts";

export default defineEventHandler(
  async (event): Promise<typeof AuthContract.login.response> => {
    type BodyType = typeof AuthContract.login.request;
    const body: BodyType = await readBody(event);

    const response = await publicServerFetch<
      typeof AuthContract.login.response
    >(event, AuthContract.login.build(), {
      method: AuthContract.login.method,
      body,
    });

    await setUserSession(event, {
      user: response?.user,
      access_token: response?.access_token,
    });

    return response;
  }
);

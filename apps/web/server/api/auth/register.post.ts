import { AuthContract } from "@pawspot/api-contracts";

export default defineEventHandler(
  async (event): Promise<typeof AuthContract.register.response> => {
    type BodyType = typeof AuthContract.register.request;
    const body: BodyType = await readBody(event);

    const response = await publicServerFetch<
      typeof AuthContract.register.response
    >(event, AuthContract.register.build(), {
      method: AuthContract.register.method,
      body,
    });

    await setUserSession(event, {
      user: response?.user,
      access_token: response?.access_token,
    });

    return response;
  }
);

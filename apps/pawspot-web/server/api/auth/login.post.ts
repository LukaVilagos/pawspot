import { AuthContract } from "@pawspot/api-contracts";

export default defineEventHandler(async (event) => {
  type BodyType = typeof AuthContract.login.request;
  const body: BodyType = await readBody(event);

  const response = await $fetch<typeof AuthContract.login.response>(
    AuthContract.login.build(),
    {
      method: AuthContract.login.method,
      body,
      baseURL: useRuntimeConfig().public.apiUrl,
    }
  );

  await setUserSession(event, {
    user: response?.user,
    access_token: response?.access_token,
  });

  return response;
});

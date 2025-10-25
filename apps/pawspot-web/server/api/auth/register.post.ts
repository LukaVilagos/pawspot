import { AuthContract } from "@pawspot/api-contracts";

export default defineEventHandler(async (event) => {
  type BodyType = typeof AuthContract.register.request;
  const body: BodyType = await readBody(event);

  const response = await $fetch<typeof AuthContract.register.response>(
    AuthContract.register.build(),
    {
      method: AuthContract.register.method,
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

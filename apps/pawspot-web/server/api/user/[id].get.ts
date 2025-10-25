import { UserContract } from "@pawspot/api-contracts";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const id = event.context.params?.id;

  if (!id) {
    throw new Error("User ID is required");
  }

  type GetByIdParams = typeof UserContract.getById.params;
  const params: GetByIdParams = { id };

  // If there's a stored session with an access token, forward it to the backend
  // so protected endpoints can be accessed.
  // `getUserSession` is provided by nuxt-auth-utils as an auto-imported server util.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const session = await getUserSession(event);

  const headers: Record<string, string> = {};
  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  return await $fetch(UserContract.getById.build(params), {
    method: UserContract.getById.method,
    baseURL: useRuntimeConfig().public.apiUrl,
    headers,
  });
});

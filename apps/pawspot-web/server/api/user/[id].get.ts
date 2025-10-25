import { UserContract } from "@pawspot/api-contracts";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const id = event.context.params?.id;

  if (!id) {
    throw new Error("User ID is required");
  }

  type GetByIdParams = typeof UserContract.getById.params;
  const params: GetByIdParams = { id };

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

import { UserContract } from "@pawspot/api-contracts";

export default defineEventHandler(
  async (event): Promise<typeof UserContract.getById.response> => {
    const id = event.context.params?.id;

    if (!id) {
      throw new Error("User ID is required");
    }

    type GetByIdParams = typeof UserContract.getById.params;
    const params: GetByIdParams = { id };

    return await protectedServerFetch<typeof UserContract.getById.response>(
      event,
      UserContract.getById.build(params),
      {
        method: UserContract.getById.method,
      }
    );
  }
);

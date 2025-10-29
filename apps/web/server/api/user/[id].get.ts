import { UserAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
  async (event): Promise<typeof UserAdminContract.getById.response> => {
    const id = event.context.params?.id;

    if (!id) {
      throw new Error("User ID is required");
    }

    type GetByIdParams = typeof UserAdminContract.getById.params;
    const params: GetByIdParams = { id };

    return await protectedServerFetch<typeof UserAdminContract.getById.response>(
      event,
      UserAdminContract.getById.build(params),
      {
        method: UserAdminContract.getById.method,
      }
    );
  }
);

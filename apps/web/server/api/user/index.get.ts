import { UserAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
  async (event): Promise<typeof UserAdminContract.getAll.response> => {
    return await publicServerFetch<typeof UserAdminContract.getAll.response>(
      event,
      UserAdminContract.getAll.route,
      {
        method: UserAdminContract.getAll.method,
      }
    );
  }
);

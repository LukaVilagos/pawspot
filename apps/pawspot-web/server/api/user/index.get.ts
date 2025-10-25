import { UserContract } from "@pawspot/api-contracts";

export default defineEventHandler(
  async (event): Promise<typeof UserContract.getAll.response> => {
    return await publicServerFetch<typeof UserContract.getAll.response>(
      event,
      UserContract.getAll.route,
      {
        method: UserContract.getAll.method,
      }
    );
  }
);

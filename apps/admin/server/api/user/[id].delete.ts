import { UserAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(async (event) => {
    const { id } = (event.context?.params ?? {}) as { id: string };

    return await protectedServerFetch(event, `/admin${UserAdminContract.delete.build({ id })}`, {
        method: UserAdminContract.delete.method,
    });
});

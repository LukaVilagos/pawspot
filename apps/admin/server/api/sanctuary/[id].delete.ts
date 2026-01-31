import { SanctuaryAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(async (event) => {
    const { id } = (event.context?.params ?? {}) as { id: string };

    return await protectedServerFetch(event, `${SanctuaryAdminContract.delete.build({ id })}`, {
        method: SanctuaryAdminContract.delete.method,
    });
});

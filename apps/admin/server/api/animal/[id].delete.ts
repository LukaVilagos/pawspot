import { AnimalAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(async (event) => {
    const { id } = (event.context?.params ?? {}) as { id: string };

    return await protectedServerFetch(event, `${AnimalAdminContract.delete.build({ id })}`, {
        method: AnimalAdminContract.delete.method,
    });
});

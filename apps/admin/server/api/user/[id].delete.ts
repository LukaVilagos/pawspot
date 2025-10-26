import { UserContract } from "@pawspot/api-contracts";

export default defineEventHandler(async (event) => {
    const { id } = (event.context?.params ?? {}) as { id: string };

    return await protectedServerFetch(event, `/admin${UserContract.delete.build({ id })}`, {
        method: UserContract.delete.method,
    });
});

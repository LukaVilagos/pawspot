import { PostAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(async (event) => {
    const { id } = (event.context?.params ?? {}) as { id: string };

    return await protectedServerFetch(event, `${PostAdminContract.delete.build({ id })}`, {
        method: PostAdminContract.delete.method,
    });
});

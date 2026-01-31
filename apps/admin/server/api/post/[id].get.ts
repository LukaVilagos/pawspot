import { PostAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof PostAdminContract.getById.response> => {
        const { id } = (event.context?.params ?? {}) as { id: string };

        return await protectedServerFetch<typeof PostAdminContract.getById.response>(
            event,
            `${PostAdminContract.getById.build({ id })}`,
            {
                method: PostAdminContract.getById.method,
            }
        );
    }
);

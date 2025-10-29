import { UserAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof UserAdminContract.getById.response> => {
        const { id } = (event.context?.params ?? {}) as { id: string };

        return await protectedServerFetch<typeof UserAdminContract.getById.response>(
            event,
            `/admin${UserAdminContract.getById.build({ id })}`,
            {
                method: UserAdminContract.getById.method,
            }
        );
    }
);

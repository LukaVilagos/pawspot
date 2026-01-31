import { SanctuaryAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof SanctuaryAdminContract.getById.response> => {
        const { id } = (event.context?.params ?? {}) as { id: string };

        return await protectedServerFetch<typeof SanctuaryAdminContract.getById.response>(
            event,
            `${SanctuaryAdminContract.getById.build({ id })}`,
            {
                method: SanctuaryAdminContract.getById.method,
            }
        );
    }
);

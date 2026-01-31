import { SanctuaryAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof SanctuaryAdminContract.removeContributor.response> => {
        const { id, userId } = (event.context?.params ?? {}) as { id: string; userId: string };

        return await protectedServerFetch<typeof SanctuaryAdminContract.removeContributor.response>(
            event,
            `${SanctuaryAdminContract.removeContributor.build({ id, userId })}`,
            {
                method: SanctuaryAdminContract.removeContributor.method,
            }
        );
    }
);

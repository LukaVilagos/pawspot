import { SanctuaryAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof SanctuaryAdminContract.addContributor.response> => {
        const { id, userId } = (event.context?.params ?? {}) as { id: string; userId: string };

        return await protectedServerFetch<typeof SanctuaryAdminContract.addContributor.response>(
            event,
            `${SanctuaryAdminContract.addContributor.build({ id, userId })}`,
            {
                method: SanctuaryAdminContract.addContributor.method,
            }
        );
    }
);

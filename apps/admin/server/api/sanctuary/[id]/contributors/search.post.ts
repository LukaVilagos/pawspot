import { SanctuaryAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof SanctuaryAdminContract.searchContributors.response> => {
        const { id } = (event.context?.params ?? {}) as { id: string };
        type BodyType = typeof SanctuaryAdminContract.searchContributors.request;
        const body: BodyType = await readBody(event);

        return await protectedServerFetch<typeof SanctuaryAdminContract.searchContributors.response>(
            event,
            `${SanctuaryAdminContract.searchContributors.build({ id })}`,
            {
                method: SanctuaryAdminContract.searchContributors.method,
                body,
            }
        );
    }
);

import { SanctuaryAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof SanctuaryAdminContract.search.response> => {
        type BodyType = typeof SanctuaryAdminContract.search.request;
        const body: BodyType = await readBody(event);

        return await protectedServerFetch<typeof SanctuaryAdminContract.search.response>(
            event,
            `${SanctuaryAdminContract.search.build()}`,
            {
                method: SanctuaryAdminContract.search.method,
                body,
            }
        );
    }
);

import { SanctuaryAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof SanctuaryAdminContract.create.response> => {
        type BodyType = typeof SanctuaryAdminContract.create.request;
        const body: BodyType = await readBody(event);

        return await protectedServerFetch<typeof SanctuaryAdminContract.create.response>(
            event,
            `${SanctuaryAdminContract.create.build()}`,
            {
                method: SanctuaryAdminContract.create.method,
                body,
            }
        );
    }
);

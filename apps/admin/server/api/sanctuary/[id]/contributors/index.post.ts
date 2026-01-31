import { SanctuaryAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof SanctuaryAdminContract.addContributor.response> => {
        const { id } = (event.context?.params ?? {}) as { id: string };
        type BodyType = typeof SanctuaryAdminContract.addContributor.request;
        const body: BodyType = await readBody(event);

        return await protectedServerFetch<typeof SanctuaryAdminContract.addContributor.response>(
            event,
            `${SanctuaryAdminContract.addContributor.build({ id })}`,
            {
                method: SanctuaryAdminContract.addContributor.method,
                body,
            }
        );
    }
);

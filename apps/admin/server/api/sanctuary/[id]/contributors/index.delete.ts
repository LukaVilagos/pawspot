import { SanctuaryAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof SanctuaryAdminContract.removeContributor.response> => {
        const { id } = (event.context?.params ?? {}) as { id: string };
        type BodyType = typeof SanctuaryAdminContract.removeContributor.request;
        const body: BodyType = await readBody(event);

        return await protectedServerFetch<typeof SanctuaryAdminContract.removeContributor.response>(
            event,
            `${SanctuaryAdminContract.removeContributor.build({ id })}`,
            {
                method: SanctuaryAdminContract.removeContributor.method,
                body,
            }
        );
    }
);

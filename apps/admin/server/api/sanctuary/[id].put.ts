import { SanctuaryAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof SanctuaryAdminContract.update.response> => {
        const { id } = (event.context?.params ?? {}) as { id: string };
        type BodyType = typeof SanctuaryAdminContract.update.request;
        const body: BodyType = await readBody(event);

        return await protectedServerFetch<typeof SanctuaryAdminContract.update.response>(
            event,
            `${SanctuaryAdminContract.update.build({ id })}`,
            {
                method: SanctuaryAdminContract.update.method,
                body,
            }
        );
    }
);

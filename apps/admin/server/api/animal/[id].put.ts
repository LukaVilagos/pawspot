import { AnimalAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof AnimalAdminContract.update.response> => {
        const { id } = (event.context?.params ?? {}) as { id: string };
        type BodyType = typeof AnimalAdminContract.update.request;
        const body: BodyType = await readBody(event);

        return await protectedServerFetch<typeof AnimalAdminContract.update.response>(
            event,
            `${AnimalAdminContract.update.build({ id })}`,
            {
                method: AnimalAdminContract.update.method,
                body,
            }
        );
    }
);

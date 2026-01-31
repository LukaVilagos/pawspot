import { AnimalAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof AnimalAdminContract.getById.response> => {
        const { id } = (event.context?.params ?? {}) as { id: string };

        return await protectedServerFetch<typeof AnimalAdminContract.getById.response>(
            event,
            `${AnimalAdminContract.getById.build({ id })}`,
            {
                method: AnimalAdminContract.getById.method,
            }
        );
    }
);

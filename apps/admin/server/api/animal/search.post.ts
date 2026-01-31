import { AnimalAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof AnimalAdminContract.search.response> => {
        type BodyType = typeof AnimalAdminContract.search.request;
        const body: BodyType = await readBody(event);

        return await protectedServerFetch<typeof AnimalAdminContract.search.response>(
            event,
            `${AnimalAdminContract.search.build()}`,
            {
                method: AnimalAdminContract.search.method,
                body,
            }
        );
    }
);

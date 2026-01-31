import { AnimalAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof AnimalAdminContract.create.response> => {
        type BodyType = typeof AnimalAdminContract.create.request;
        const body: BodyType = await readBody(event);

        return await protectedServerFetch<typeof AnimalAdminContract.create.response>(
            event,
            `${AnimalAdminContract.create.build()}`,
            {
                method: AnimalAdminContract.create.method,
                body,
            }
        );
    }
);

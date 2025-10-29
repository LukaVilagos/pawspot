import { UserAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof UserAdminContract.create.response> => {
        type BodyType = typeof UserAdminContract.create.request;
        const body: BodyType = await readBody(event);

        return await protectedServerFetch<typeof UserAdminContract.create.response>(
            event,
            `/admin${UserAdminContract.create.build()}`,
            {
                method: UserAdminContract.create.method,
                body,
            }
        );
    }
);

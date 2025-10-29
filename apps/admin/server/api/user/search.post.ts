import { UserAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof UserAdminContract.search.response> => {
        type BodyType = typeof UserAdminContract.search.request;
        const body: BodyType = await readBody(event);

        return await protectedServerFetch<typeof UserAdminContract.search.response>(
            event,
            `/admin${UserAdminContract.search.build()}`,
            {
                method: UserAdminContract.search.method,
                body,
            }
        );
    }
);

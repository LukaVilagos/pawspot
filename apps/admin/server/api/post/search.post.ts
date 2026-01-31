import { PostAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof PostAdminContract.search.response> => {
        type BodyType = typeof PostAdminContract.search.request;
        const body: BodyType = await readBody(event);

        return await protectedServerFetch<typeof PostAdminContract.search.response>(
            event,
            `${PostAdminContract.search.build()}`,
            {
                method: PostAdminContract.search.method,
                body,
            }
        );
    }
);

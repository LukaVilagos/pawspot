import { PostAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof PostAdminContract.create.response> => {
        type BodyType = typeof PostAdminContract.create.request;
        const body: BodyType = await readBody(event);

        return await protectedServerFetch<typeof PostAdminContract.create.response>(
            event,
            `${PostAdminContract.create.build()}`,
            {
                method: PostAdminContract.create.method,
                body,
            }
        );
    }
);

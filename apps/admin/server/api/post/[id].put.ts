import { PostAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof PostAdminContract.update.response> => {
        const { id } = (event.context?.params ?? {}) as { id: string };
        type BodyType = typeof PostAdminContract.update.request;
        const body: BodyType = await readBody(event);

        return await protectedServerFetch<typeof PostAdminContract.update.response>(
            event,
            `${PostAdminContract.update.build({ id })}`,
            {
                method: PostAdminContract.update.method,
                body,
            }
        );
    }
);

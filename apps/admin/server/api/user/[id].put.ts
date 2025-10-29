import { UserAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof UserAdminContract.update.response> => {
        const { id } = (event.context?.params ?? {}) as { id: string };
        type BodyType = typeof UserAdminContract.update.request;
        const body: BodyType = await readBody(event);

        return await protectedServerFetch<typeof UserAdminContract.update.response>(
            event,
            `${UserAdminContract.update.build({ id })}`,
            {
                method: UserAdminContract.update.method,
                body,
            }
        );
    }
);

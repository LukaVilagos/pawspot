import { UserContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof UserContract.update.response> => {
        const { id } = (event.context?.params ?? {}) as { id: string };
        type BodyType = typeof UserContract.update.request;
        const body: BodyType = await readBody(event);

        return await protectedServerFetch<typeof UserContract.update.response>(
            event,
            `/admin${UserContract.update.build({ id })}`,
            {
                method: UserContract.update.method,
                body,
            }
        );
    }
);

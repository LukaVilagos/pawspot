import { UserContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof UserContract.getById.response> => {
        const { id } = (event.context?.params ?? {}) as { id: string };

        return await protectedServerFetch<typeof UserContract.getById.response>(
            event,
            `/admin${UserContract.getById.build({ id })}`,
            {
                method: UserContract.getById.method,
            }
        );
    }
);

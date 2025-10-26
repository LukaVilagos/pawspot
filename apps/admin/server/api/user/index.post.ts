import { UserContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof UserContract.create.response> => {
        type BodyType = typeof UserContract.create.request;
        const body: BodyType = await readBody(event);

        return await protectedServerFetch<typeof UserContract.create.response>(
            event,
            `/admin${UserContract.create.build()}`,
            {
                method: UserContract.create.method,
                body,
            }
        );
    }
);

import { UserContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof UserContract.search.response> => {
        console.log("Handling user search request");
        type BodyType = typeof UserContract.search.request;
        const body: BodyType = await readBody(event);

        return await protectedServerFetch<typeof UserContract.search.response>(
            event,
            `/admin${UserContract.search.build()}`,
            {
                method: UserContract.search.method,
                body,
            }
        );
    }
);

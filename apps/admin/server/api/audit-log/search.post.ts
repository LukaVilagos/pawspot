import { AuditLogAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof AuditLogAdminContract.search.response> => {
        type BodyType = typeof AuditLogAdminContract.search.request;
        const body: BodyType = await readBody(event);

        return await protectedServerFetch<typeof AuditLogAdminContract.search.response>(
            event,
            `${AuditLogAdminContract.search.build()}`,
            {
                method: AuditLogAdminContract.search.method,
                body,
            }
        );
    }
);

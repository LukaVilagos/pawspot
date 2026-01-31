import { AuditLogAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof AuditLogAdminContract.getById.response> => {
        const { id } = (event.context?.params ?? {}) as { id: string };

        return await protectedServerFetch<typeof AuditLogAdminContract.getById.response>(
            event,
            `${AuditLogAdminContract.getById.build({ id })}`,
            {
                method: AuditLogAdminContract.getById.method,
            }
        );
    }
);

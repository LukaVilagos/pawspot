import type {
    AuditLogResponse,
    PaginatedResponse,
    QueryOptions,
} from "@pawspot/api-contracts";

export const useAuditLogApi = () => {
    const getAuditLogById = async (id: string) => {
        return await useAuthFetch<AuditLogResponse>(`/api/audit-log/${id}`);
    };

    const searchAuditLogs = async (query: QueryOptions<AuditLogResponse>) => {
        return await $fetch<PaginatedResponse<AuditLogResponse>>(
            "/api/audit-log/search",
            {
                method: "POST",
                body: query,
            }
        );
    };

    return {
        getAuditLogById,
        searchAuditLogs,
    };
};

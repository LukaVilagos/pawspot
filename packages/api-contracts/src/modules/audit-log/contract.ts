import { ADMIN_AUDIT_LOG_ROUTES } from './routes';
import type { AuditLogResponseDto, PaginatedAuditLogResponseDto } from './dtos';
import { QueryOptions, PaginatedResponse } from '../..';

export const AuditLogAdminContract = {
    getById: {
        method: 'GET' as const,
        route: ADMIN_AUDIT_LOG_ROUTES.BY_ID,
        params: {} as { id: string },
        build: (p: { id: string }) => `${ADMIN_AUDIT_LOG_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
        response: {} as AuditLogResponseDto,
    },
    search: {
        method: 'POST' as const,
        route: ADMIN_AUDIT_LOG_ROUTES.SEARCH,
        build: () => `${ADMIN_AUDIT_LOG_ROUTES.ROOT}/${ADMIN_AUDIT_LOG_ROUTES.SEARCH}`,
        request: {} as QueryOptions<AuditLogResponseDto>,
        response: {} as PaginatedResponse<AuditLogResponseDto>,
    },
} as const;

export type AuditLogAdminContractType = typeof AuditLogAdminContract;

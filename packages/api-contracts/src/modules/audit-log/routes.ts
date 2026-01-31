export const ADMIN_AUDIT_LOG_ROUTES = {
    ROOT: '/admin/audit-log',
    BY_ID: ':id',
    SEARCH: 'search',
} as const;

export type AdminAuditLogRoutes = typeof ADMIN_AUDIT_LOG_ROUTES;

export const ADMIN_USER_ROUTES = {
    NORMAL_ROOT: '/user',
    ROOT: '/admin/user',
    BY_ID: ':id',
    CREATE: '',
    UPDATE: ':id',
    DELETE: ':id',
    SEARCH: 'search',
} as const;

export type AdminUserRoutes = typeof ADMIN_USER_ROUTES;
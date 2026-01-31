export const ADMIN_POST_ROUTES = {
    ROOT: '/admin/post',
    BY_ID: ':id',
    CREATE: '',
    UPDATE: ':id',
    DELETE: ':id',
    SEARCH: 'search',
} as const;

export const POST_ROUTES = {
    ROOT: '/post',
    BY_ID: ':id',
} as const;

export type AdminPostRoutes = typeof ADMIN_POST_ROUTES;
export type PostRoutes = typeof POST_ROUTES;

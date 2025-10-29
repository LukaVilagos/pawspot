export const AUTH_ROUTES = {
    ROOT: '/auth',
    LOGIN: 'login',
    REGISTER: 'register',
} as const;

export const ADMIN_AUTH_ROUTES = {
    ROOT: '/admin/auth',
    LOGIN: 'login',
} as const;

export type AuthRoutes = typeof AUTH_ROUTES;
export type AdminAuthRoutes = typeof ADMIN_AUTH_ROUTES;
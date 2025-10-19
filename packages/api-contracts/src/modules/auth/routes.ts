export const AUTH_ROUTES = {
    ROOT: '/auth',
    LOGIN: 'login',
    REGISTER: 'register',
} as const;

export type AuthRoutes = typeof AUTH_ROUTES;
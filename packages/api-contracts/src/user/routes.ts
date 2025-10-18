export const USER_ROUTES = {
    ROOT: '/user',
    BY_ID: ':id',
} as const;

export type UserRoutes = typeof USER_ROUTES;

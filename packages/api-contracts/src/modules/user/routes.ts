export const USER_ROUTES = {
    ROOT: '/user',
    BY_ID: ':id',
    CREATE: '',
    UPDATE: ':id',
    DELETE: ':id',
    SEARCH: 'search',
} as const;

export type UserRoutes = typeof USER_ROUTES;
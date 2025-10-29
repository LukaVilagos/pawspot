export const SANCTUARY_ROUTES = {
    ROOT: '/sanctuary',
    BY_ID: ':id',
    CREATE: '',
    UPDATE: ':id',
    DELETE: ':id',
    SEARCH: 'search',
} as const;

export type SanctuaryRoutes = typeof SANCTUARY_ROUTES;
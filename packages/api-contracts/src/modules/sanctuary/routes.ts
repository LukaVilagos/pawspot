export const SANCTUARY_ROUTES = {
    ROOT: '/sanctuary',
    BY_ID: ':id',
    CREATE: 'sanctuary',
    UPDATE: 'sanctuary/:id',
    DELETE: 'sanctuary/:id',
    SEARCH: 'search',
} as const;

export type SanctuaryRoutes = typeof SANCTUARY_ROUTES;
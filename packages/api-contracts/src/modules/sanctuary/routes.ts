export const SANCTUARY_ADMIN_ROUTES = {
    ROOT: '/admin/sanctuary',
    BY_ID: ':id',
    CREATE: '',
    UPDATE: ':id',
    DELETE: ':id',
    SEARCH: 'search',
    ADD_CONTRIBUTOR: ':id/contributors',
    REMOVE_CONTRIBUTOR: ':id/contributors',
    SEARCH_CONTRIBUTORS: ':id/contributors/search',
} as const;

export const SANCTUARY_ROUTES = {
    ROOT: '/sanctuary',
    BY_LOCATION: ':location',
    BY_ID: ':id',
    CREATE: '',
    UPDATE: ':id',
    DELETE: ':id',
    JOIN: ':id/join',
    LEAVE: ':id/leave',
} as const;

export type SanctuaryAdminRoutes = typeof SANCTUARY_ADMIN_ROUTES;
export type SanctuaryRoutes = typeof SANCTUARY_ROUTES;
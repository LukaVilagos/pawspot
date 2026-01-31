export const ADMIN_ANIMAL_ROUTES = {
    ROOT: '/admin/animal',
    BY_ID: ':id',
    CREATE: '',
    UPDATE: ':id',
    DELETE: ':id',
    SEARCH: 'search',
} as const;

export const ANIMAL_ROUTES = {
    ROOT: '/animal',
    BY_ID: ':id',
} as const;

export type AdminAnimalRoutes = typeof ADMIN_ANIMAL_ROUTES;
export type AnimalRoutes = typeof ANIMAL_ROUTES;
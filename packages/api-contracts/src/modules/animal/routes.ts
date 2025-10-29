export const ANIMAL_ROUTES = {
    ROOT: '/animals',
    BY_ID: ":id",
    CREATE: '',
    UPDATE: ':id',
    DELETE: ':id',
    SEARCH: 'search',
}

export type AnimalRoutes = typeof ANIMAL_ROUTES;
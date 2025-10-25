export const ANIMAL_ROUTES = {
    ROOT: '/animals',
    BY_ID: ":id",
    CREATE: 'animal',
    UPDATE: 'animal/:id',
    DELETE: 'animal/:id',
    SEARCH: 'search',
}

export type AnimalRoutes = typeof ANIMAL_ROUTES;
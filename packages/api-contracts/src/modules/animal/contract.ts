import { ANIMAL_ROUTES } from './routes';
import type {
    AnimalsListResponseDto,
    AnimalResponseDto,
    CreateAnimalRequestDto,
} from './dtos';
import { QueryOptions, PaginatedResponse } from '../..';

export const AnimalContract = {
    getAll: {
        method: 'GET' as const,
        route: ANIMAL_ROUTES.ROOT,
        response: {} as AnimalsListResponseDto,
    },
    getById: {
        method: 'GET' as const,
        route: ANIMAL_ROUTES.BY_ID,
        params: {} as { id: string },
        build: (p: { id: string }) => `${ANIMAL_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
        response: {} as AnimalResponseDto,
    },
    create: {
        method: 'POST' as const,
        route: ANIMAL_ROUTES.CREATE,
        build: () => `${ANIMAL_ROUTES.ROOT}/${ANIMAL_ROUTES.CREATE}`,
        request: {} as CreateAnimalRequestDto,
        response: {} as AnimalResponseDto,
    },
    update: {
        method: 'PUT' as const,
        route: ANIMAL_ROUTES.UPDATE,
        params: {} as { id: string },
        build: (p: { id: string }) => `${ANIMAL_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
        request: {} as Partial<CreateAnimalRequestDto>,
        response: {} as AnimalResponseDto,
    },
    delete: {
        method: 'DELETE' as const,
        route: ANIMAL_ROUTES.DELETE,
        params: {} as { id: string },
        build: (p: { id: string }) => `${ANIMAL_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
    },
    search: {
        method: 'POST' as const,
        route: ANIMAL_ROUTES.SEARCH,
        build: () => `${ANIMAL_ROUTES.ROOT}/${ANIMAL_ROUTES.SEARCH}`,
        request: {} as QueryOptions<AnimalResponseDto>,
        response: {} as PaginatedResponse<AnimalResponseDto>,
    },
} as const;


export type AnimalContractType = typeof AnimalContract;

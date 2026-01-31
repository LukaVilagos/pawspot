import { ADMIN_ANIMAL_ROUTES, ANIMAL_ROUTES } from './routes';
import type {
    AnimalsListResponseDto,
    AnimalResponseDto,
    CreateAnimalRequestDto,
    UpdateAnimalRequestDto,
} from './dtos';
import { QueryOptions, PaginatedResponse } from '../..';

export const AnimalAdminContract = {
    getAll: {
        method: 'GET' as const,
        route: ADMIN_ANIMAL_ROUTES.ROOT,
        response: {} as AnimalsListResponseDto,
    },
    getById: {
        method: 'GET' as const,
        route: ADMIN_ANIMAL_ROUTES.BY_ID,
        params: {} as { id: string },
        build: (p: { id: string }) => `${ADMIN_ANIMAL_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
        response: {} as AnimalResponseDto,
    },
    create: {
        method: 'POST' as const,
        route: ADMIN_ANIMAL_ROUTES.CREATE,
        build: () => `${ADMIN_ANIMAL_ROUTES.ROOT}/${ADMIN_ANIMAL_ROUTES.CREATE}`,
        request: {} as CreateAnimalRequestDto,
        response: {} as AnimalResponseDto,
    },
    update: {
        method: 'PUT' as const,
        route: ADMIN_ANIMAL_ROUTES.UPDATE,
        params: {} as { id: string },
        build: (p: { id: string }) => `${ADMIN_ANIMAL_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
        request: {} as UpdateAnimalRequestDto,
        response: {} as AnimalResponseDto,
    },
    delete: {
        method: 'DELETE' as const,
        route: ADMIN_ANIMAL_ROUTES.DELETE,
        params: {} as { id: string },
        build: (p: { id: string }) => `${ADMIN_ANIMAL_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
    },
    search: {
        method: 'POST' as const,
        route: ADMIN_ANIMAL_ROUTES.SEARCH,
        build: () => `${ADMIN_ANIMAL_ROUTES.ROOT}/${ADMIN_ANIMAL_ROUTES.SEARCH}`,
        request: {} as QueryOptions<AnimalResponseDto>,
        response: {} as PaginatedResponse<AnimalResponseDto>,
    },
} as const;

export const AnimalContract = {
    getById: {
        method: 'GET' as const,
        route: ANIMAL_ROUTES.BY_ID,
        params: {} as { id: string },
        build: (p: { id: string }) => `${ANIMAL_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
        response: {} as AnimalResponseDto,
    },
} as const;

export type AnimalAdminContractType = typeof AnimalAdminContract;
export type AnimalContractType = typeof AnimalContract;

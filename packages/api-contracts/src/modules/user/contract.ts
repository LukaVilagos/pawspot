import { ADMIN_USER_ROUTES, USER_ROUTES } from './routes';
import type {
    UsersListResponseDto,
    UserResponseDto,
    CreateUserRequestDto,
    AdminUpdateUserRequestDto
} from './dtos';
import { QueryOptions, PaginatedResponse } from '../..';

export const UserAdminContract = {
    getAll: {
        method: 'GET' as const,
        route: ADMIN_USER_ROUTES.ROOT,
        response: {} as UsersListResponseDto,
    },
    getById: {
        method: 'GET' as const,
        route: ADMIN_USER_ROUTES.BY_ID,
        params: {} as { id: string },
        build: (p: { id: string }) => `${ADMIN_USER_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
        response: {} as UserResponseDto,
    },
    create: {
        method: 'POST' as const,
        route: ADMIN_USER_ROUTES.CREATE,
        build: () => `${ADMIN_USER_ROUTES.ROOT}/${ADMIN_USER_ROUTES.CREATE}`,
        request: {} as CreateUserRequestDto,
        response: {} as UserResponseDto,
    },
    update: {
        method: 'PUT' as const,
        route: ADMIN_USER_ROUTES.UPDATE,
        params: {} as { id: string },
        build: (p: { id: string }) => `${ADMIN_USER_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
        request: {} as AdminUpdateUserRequestDto,
        response: {} as UserResponseDto,
    },
    delete: {
        method: 'DELETE' as const,
        route: ADMIN_USER_ROUTES.DELETE,
        params: {} as { id: string },
        build: (p: { id: string }) => `${ADMIN_USER_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
    },
    search: {
        method: 'POST' as const,
        route: ADMIN_USER_ROUTES.SEARCH,
        build: () => `${ADMIN_USER_ROUTES.ROOT}/${ADMIN_USER_ROUTES.SEARCH}`,
        request: {} as QueryOptions<UserResponseDto>,
        response: {} as PaginatedResponse<UserResponseDto>,
    },
} as const;

export const UserContract = {
    getAll: {
        method: 'GET' as const,
        route: USER_ROUTES.ROOT,
        build: () => `${USER_ROUTES.ROOT}`,
        response: {} as UsersListResponseDto,
    },
    getById: {
        method: 'GET' as const,
        route: USER_ROUTES.BY_ID,
        params: {} as { id: string },
        build: (p: { id: string }) => `${USER_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
        response: {} as UserResponseDto,
    },
}


export type UserAdminContractType = typeof UserAdminContract;
import { USER_ROUTES } from './routes';
import type {
    UsersListResponseDto,
    UserResponseDto,
    CreateUserRequestDto
} from './dtos';
import { ApiRequest, PaginatedResponse } from '../..';

export const UserContract = {
    getAll: {
        method: 'GET' as const,
        route: USER_ROUTES.ROOT,
        params: {} as ApiRequest<UserResponseDto>,
        response: {} as PaginatedResponse<UsersListResponseDto>,
    },
    getById: {
        method: 'GET' as const,
        route: USER_ROUTES.BY_ID,
        params: {} as { id: string },
        build: (p: { id: string }) => `${USER_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
        response: {} as UserResponseDto,
    },
    create: {
        method: 'POST' as const,
        route: USER_ROUTES.CREATE,
        build: () => `${USER_ROUTES.ROOT}/${USER_ROUTES.CREATE}`,
        request: {} as CreateUserRequestDto,
        response: {} as UserResponseDto,
    },
    update: {
        method: 'PUT' as const,
        route: USER_ROUTES.UPDATE,
        params: {} as { id: string },
        build: (p: { id: string }) => `${USER_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
        request: {} as Partial<CreateUserRequestDto>,
        response: {} as UserResponseDto,
    },
    delete: {
        method: 'DELETE' as const,
        route: USER_ROUTES.DELETE,
        params: {} as { id: string },
        build: (p: { id: string }) => `${USER_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
    },
} as const;


export type UserContractType = typeof UserContract;
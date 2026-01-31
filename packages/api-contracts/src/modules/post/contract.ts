import { ADMIN_POST_ROUTES, POST_ROUTES } from './routes';
import type { PostsListResponseDto, PostResponseDto, CreatePostRequestDto, UpdatePostRequestDto } from './dtos';
import { QueryOptions, PaginatedResponse } from '../..';

export const PostAdminContract = {
    getAll: {
        method: 'GET' as const,
        route: ADMIN_POST_ROUTES.ROOT,
        response: {} as PostsListResponseDto,
    },
    getById: {
        method: 'GET' as const,
        route: ADMIN_POST_ROUTES.BY_ID,
        params: {} as { id: string },
        build: (p: { id: string }) => `${ADMIN_POST_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
        response: {} as PostResponseDto,
    },
    create: {
        method: 'POST' as const,
        route: ADMIN_POST_ROUTES.CREATE,
        build: () => `${ADMIN_POST_ROUTES.ROOT}/${ADMIN_POST_ROUTES.CREATE}`,
        request: {} as CreatePostRequestDto,
        response: {} as PostResponseDto,
    },
    update: {
        method: 'PUT' as const,
        route: ADMIN_POST_ROUTES.UPDATE,
        params: {} as { id: string },
        build: (p: { id: string }) => `${ADMIN_POST_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
        request: {} as UpdatePostRequestDto,
        response: {} as PostResponseDto,
    },
    delete: {
        method: 'DELETE' as const,
        route: ADMIN_POST_ROUTES.DELETE,
        params: {} as { id: string },
        build: (p: { id: string }) => `${ADMIN_POST_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
    },
    search: {
        method: 'POST' as const,
        route: ADMIN_POST_ROUTES.SEARCH,
        build: () => `${ADMIN_POST_ROUTES.ROOT}/${ADMIN_POST_ROUTES.SEARCH}`,
        request: {} as QueryOptions<PostResponseDto>,
        response: {} as PaginatedResponse<PostResponseDto>,
    },
} as const;

export const PostContract = {
    getById: {
        method: 'GET' as const,
        route: POST_ROUTES.BY_ID,
        params: {} as { id: string },
        build: (p: { id: string }) => `${POST_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
        response: {} as PostResponseDto,
    },
} as const;

export type PostAdminContractType = typeof PostAdminContract;
export type PostContractType = typeof PostContract;

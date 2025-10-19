import { USER_ROUTES } from './routes';
import type {
    UsersListResponseDto,
    UserResponseDto
} from './dtos';

export const UserContract = {
    getAll: {
        method: 'GET' as const,
        route: USER_ROUTES.ROOT,
        response: {} as UsersListResponseDto,
    },
    getById: {
        method: 'GET' as const,
        route: USER_ROUTES.BY_ID,
        params: {} as { id: string },
        build: (p: { id: string }) => `${USER_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
        response: {} as UserResponseDto,
    },
} as const;


export type UserContractType = typeof UserContract;
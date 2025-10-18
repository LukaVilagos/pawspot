import { USER_ROUTES } from './routes';
import type {
    UsersListResponseDto,
    UserFilters
} from './dtos';

export const UserContract = {
    getAll: {
        method: 'GET' as const,
        route: USER_ROUTES.ROOT,
        query: {} as UserFilters,
        response: {} as UsersListResponseDto,
    },
} as const;


export type UserContractType = typeof UserContract;
import { PaginatedResponse, QueryOptions } from "../../shared";
import { CreateSanctuaryRequestDto, SanctuariesListResponseDto, SanctuaryResponseDto } from "./dtos";
import { SANCTUARY_ROUTES } from "./routes";

export const SanctuaryContract = {
    getAll: {
        method: 'GET' as const,
        route: SANCTUARY_ROUTES.ROOT,
        response: {} as SanctuariesListResponseDto,
    },
    getById: {
        method: 'GET' as const,
        route: SANCTUARY_ROUTES.BY_ID,
        params: {} as { id: string },
        build: (p: { id: string }) => `${SANCTUARY_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
        response: {} as SanctuaryResponseDto,
    },
    create: {
        method: 'POST' as const,
        route: SANCTUARY_ROUTES.CREATE,
        build: () => `${SANCTUARY_ROUTES.ROOT}/${SANCTUARY_ROUTES.CREATE}`,
        request: {} as CreateSanctuaryRequestDto,
        response: {} as SanctuaryResponseDto,
    },
    update: {
        method: 'PUT' as const,
        route: SANCTUARY_ROUTES.UPDATE,
        params: {} as { id: string },
        build: (p: { id: string }) => `${SANCTUARY_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
        request: {} as Partial<CreateSanctuaryRequestDto>,
        response: {} as SanctuaryResponseDto,
    },
    delete: {
        method: 'DELETE' as const,
        route: SANCTUARY_ROUTES.DELETE,
        params: {} as { id: string },
        build: (p: { id: string }) => `${SANCTUARY_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
    },
    search: {
        method: 'POST' as const,
        route: SANCTUARY_ROUTES.SEARCH,
        build: () => `${SANCTUARY_ROUTES.ROOT}/${SANCTUARY_ROUTES.SEARCH}`,
        request: {} as QueryOptions<SanctuaryResponseDto>,
        response: {} as PaginatedResponse<SanctuaryResponseDto>,
    },
} as const;

export type SanctuaryContractType = typeof SanctuaryContract;
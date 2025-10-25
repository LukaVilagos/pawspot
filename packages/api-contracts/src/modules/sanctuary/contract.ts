import { PaginatedResponse } from "../../shared";
import { CreateSanctuaryRequestDto, SanctuariesListResponseDto, SanctuaryResponseDto } from "./dtos";
import { SANCTUARY_ROUTES } from "./routes";

export const SanctuarryContract = {
    getAll: {
        method: 'GET' as const,
        route: SANCTUARY_ROUTES.ROOT,
        response: {} as PaginatedResponse<SanctuariesListResponseDto>,
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
} as const;

export type SanctuaryContractType = typeof SanctuarryContract;
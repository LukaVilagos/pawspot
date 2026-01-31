import { PaginatedResponse, QueryOptions } from "../../shared";
import { CreateSanctuaryRequestDto, SanctuariesListResponseDto, SanctuaryResponseDto, UpdateSanctuaryRequestDto } from "./dtos";
import { SANCTUARY_ADMIN_ROUTES, SANCTUARY_ROUTES } from "./routes";
import { UserSummaryDto } from "../user";

export const SanctuaryAdminContract = {
    getAll: {
        method: 'GET' as const,
        route: SANCTUARY_ADMIN_ROUTES.ROOT,
        response: {} as SanctuariesListResponseDto,
    },
    getById: {
        method: 'GET' as const,
        route: SANCTUARY_ADMIN_ROUTES.BY_ID,
        params: {} as { id: string },
        build: (p: { id: string }) => `${SANCTUARY_ADMIN_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
        response: {} as SanctuaryResponseDto,
    },
    create: {
        method: 'POST' as const,
        route: SANCTUARY_ADMIN_ROUTES.CREATE,
        build: () => `${SANCTUARY_ADMIN_ROUTES.ROOT}/${SANCTUARY_ADMIN_ROUTES.CREATE}`,
        request: {} as CreateSanctuaryRequestDto,
        response: {} as SanctuaryResponseDto,
    },
    update: {
        method: 'PUT' as const,
        route: SANCTUARY_ADMIN_ROUTES.UPDATE,
        params: {} as { id: string },
        build: (p: { id: string }) => `${SANCTUARY_ADMIN_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
        request: {} as Partial<CreateSanctuaryRequestDto>,
        response: {} as SanctuaryResponseDto,
    },
    delete: {
        method: 'DELETE' as const,
        route: SANCTUARY_ADMIN_ROUTES.DELETE,
        params: {} as { id: string },
        build: (p: { id: string }) => `${SANCTUARY_ADMIN_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
    },
    search: {
        method: 'POST' as const,
        route: SANCTUARY_ADMIN_ROUTES.SEARCH,
        build: () => `${SANCTUARY_ADMIN_ROUTES.ROOT}/${SANCTUARY_ADMIN_ROUTES.SEARCH}`,
        request: {} as QueryOptions<SanctuaryResponseDto>,
        response: {} as PaginatedResponse<SanctuaryResponseDto>,
    },
    addContributor: {
        method: 'POST' as const,
        route: SANCTUARY_ADMIN_ROUTES.ADD_CONTRIBUTOR,
        params: {} as { id: string },
        build: (p: { id: string }) => `${SANCTUARY_ADMIN_ROUTES.ROOT}/${encodeURIComponent(p.id)}/contributors`,
        request: {} as { userId: string },
        response: {} as SanctuaryResponseDto,
    },
    removeContributor: {
        method: 'DELETE' as const,
        route: SANCTUARY_ADMIN_ROUTES.REMOVE_CONTRIBUTOR,
        params: {} as { id: string },
        build: (p: { id: string }) => `${SANCTUARY_ADMIN_ROUTES.ROOT}/${encodeURIComponent(p.id)}/contributors`,
        request: {} as { userId: string },
        response: {} as SanctuaryResponseDto,
    },
    searchContributors: {
        method: 'POST' as const,
        route: SANCTUARY_ADMIN_ROUTES.SEARCH_CONTRIBUTORS,
        params: {} as { id: string },
        build: (p: { id: string }) => `${SANCTUARY_ADMIN_ROUTES.ROOT}/${encodeURIComponent(p.id)}/contributors/search`,
        request: {} as QueryOptions<UserSummaryDto>,
        response: {} as PaginatedResponse<UserSummaryDto>,
    },
    generateQrCode: {
        method: 'POST' as const,
        route: SANCTUARY_ADMIN_ROUTES.GENERATE_QR_CODE,
        params: {} as { id: string },
        build: (p: { id: string }) => `${SANCTUARY_ADMIN_ROUTES.ROOT}/${encodeURIComponent(p.id)}/qr-code`,
        response: {} as SanctuaryResponseDto,
    }
} as const;

export const SanctuaryContract = {
    getByLocation: {
        method: 'GET' as const,
        route: SANCTUARY_ROUTES.BY_LOCATION,
        params: {} as { location: string },
        build: (p: { location: string }) => `${SANCTUARY_ROUTES.ROOT}/${encodeURIComponent(p.location)}`,
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
        request: {} as UpdateSanctuaryRequestDto,
        response: {} as SanctuaryResponseDto,
    },
    delete: {
        method: 'DELETE' as const,
        route: SANCTUARY_ROUTES.DELETE,
        params: {} as { id: string },
        build: (p: { id: string }) => `${SANCTUARY_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
    },
    join: {
        method: 'POST' as const,
        route: SANCTUARY_ROUTES.JOIN,
        params: {} as { id: string },
        build: (p: { id: string }) => `${SANCTUARY_ROUTES.ROOT}/${encodeURIComponent(p.id)}/join`,
    },
    leave: {
        method: 'POST' as const,
        route: SANCTUARY_ROUTES.LEAVE,
        params: {} as { id: string },
        build: (p: { id: string }) => `${SANCTUARY_ROUTES.ROOT}/${encodeURIComponent(p.id)}/leave`,
    }
} as const;

export type SanctuaryAdminContractType = typeof SanctuaryAdminContract;
export type SanctuaryContractType = typeof SanctuaryContract;
import { QRCODE_ROUTES } from './routes';
import type {
    QrCodesListResponseDto,
    QrCodeResponseDto,
    CreateQrCodeRequestDto,
} from './dtos';
import { QueryOptions, PaginatedResponse } from '../..';

export const QrCodeContract = {
    getAll: {
        method: 'GET' as const,
        route: QRCODE_ROUTES.ROOT,
        response: {} as QrCodesListResponseDto,
    },
    getById: {
        method: 'GET' as const,
        route: QRCODE_ROUTES.BY_ID,
        params: {} as { id: string },
        build: (p: { id: string }) => `${QRCODE_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
        response: {} as QrCodeResponseDto,
    },
    create: {
        method: 'POST' as const,
        route: QRCODE_ROUTES.CREATE,
        build: () => `${QRCODE_ROUTES.ROOT}/${QRCODE_ROUTES.CREATE}`,
        request: {} as CreateQrCodeRequestDto,
        response: {} as QrCodeResponseDto,
    },
    update: {
        method: 'PUT' as const,
        route: QRCODE_ROUTES.UPDATE,
        params: {} as { id: string },
        build: (p: { id: string }) => `${QRCODE_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
        request: {} as Partial<CreateQrCodeRequestDto>,
        response: {} as QrCodeResponseDto,
    },
    delete: {
        method: 'DELETE' as const,
        route: QRCODE_ROUTES.DELETE,
        params: {} as { id: string },
        build: (p: { id: string }) => `${QRCODE_ROUTES.ROOT}/${encodeURIComponent(p.id)}`,
    },
    search: {
        method: 'POST' as const,
        route: QRCODE_ROUTES.SEARCH,
        build: () => `${QRCODE_ROUTES.ROOT}/${QRCODE_ROUTES.SEARCH}`,
        request: {} as QueryOptions<QrCodeResponseDto>,
        response: {} as PaginatedResponse<QrCodeResponseDto>,
    },
} as const;

export type QrCodeContractType = typeof QrCodeContract;

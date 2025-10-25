export const QRCODE_ROUTES = {
    ROOT: '/qrcodes',
    BY_ID: ':id',
    CREATE: 'qrcode',
    UPDATE: 'qrcode/:id',
    DELETE: 'qrcode/:id',
    SEARCH: 'search',
}

export type QrCodeRoutes = typeof QRCODE_ROUTES;

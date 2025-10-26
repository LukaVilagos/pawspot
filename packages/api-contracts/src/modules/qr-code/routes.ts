export const QRCODE_ROUTES = {
    ROOT: '/qrcodes',
    BY_ID: ':id',
    CREATE: '',
    UPDATE: '/:id',
    DELETE: '/:id',
    SEARCH: 'search',
}

export type QrCodeRoutes = typeof QRCODE_ROUTES;

export function normalizeApiError(e: any) {
    const data = e?.response?.data

    if (data?.errors && typeof data.errors === 'object') {
        return { errors: data.errors }
    }

    if (data?.field && data?.message) {
        return { field: data.field, message: data.message }
    }

    if (data?.message) {
        return { message: data.message }
    }

    return { message: e?.message ?? 'Unknown error' }
}
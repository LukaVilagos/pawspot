export function generateTableKey<T extends { id?: string | number }>(searchResult?: {
    page?: number
    total?: number
    items?: T[]
}): string {
    const page = searchResult?.page ?? 1
    const total = searchResult?.total ?? 0
    const ids = (searchResult?.items || []).map(i => i?.id ?? '').join(',')
    return `${page}-${total}-${ids}`
}
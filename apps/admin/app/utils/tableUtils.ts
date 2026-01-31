import type { TypedTableColumn } from '~/types/table-types'

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

export function createIdColumn<T extends Record<string, unknown>>(width: string = '15%'): TypedTableColumn<T> {
    return {
        accessorKey: 'id' as keyof T & string,
        header: 'ID',
        sortable: true,
        filter: { type: 'text' },
        meta: {
            style: {
                th: `width: ${width}`,
                td: `width: ${width}`
            }
        }
    }
}

export function createCreatedAtColumn<T extends Record<string, unknown>>(width: string = '20%'): TypedTableColumn<T> {
    return {
        accessorKey: 'createdAt' as keyof T & string,
        header: 'Created At',
        sortable: true,
        filter: { type: 'range' },
        meta: {
            style: {
                th: `width: ${width}`,
                td: `width: ${width}`
            }
        }
    }
}

export function createTextColumn<T extends Record<string, unknown>>(
    accessorKey: keyof T & string,
    header: string,
    width: string,
    options?: { sortable?: boolean; filterable?: boolean }
): TypedTableColumn<T> {
    const { sortable = true, filterable = true } = options ?? {}
    return {
        accessorKey,
        header,
        sortable,
        filter: filterable ? { type: 'text' } : undefined,
        meta: {
            style: {
                th: `width: ${width}`,
                td: `width: ${width}`
            }
        }
    }
}

export function createNumberColumn<T extends Record<string, unknown>>(
    accessorKey: keyof T & string,
    header: string,
    width: string,
    options?: { sortable?: boolean; filterable?: boolean }
): TypedTableColumn<T> {
    const { sortable = true, filterable = true } = options ?? {}
    return {
        accessorKey,
        header,
        sortable,
        filter: filterable ? { type: 'number' } : undefined,
        meta: {
            style: {
                th: `width: ${width}`,
                td: `width: ${width}`
            }
        }
    }
}

export function createLinkColumn<T extends Record<string, unknown>>(
    accessorKey: keyof T & string,
    header: string,
    width: string,
    linkConfig: {
        href: (row: T) => string
        label: (row: T) => string
        sortKey?: string
        nestedFilterKey?: string
    }
): TypedTableColumn<T> {
    return {
        accessorKey,
        header,
        sortable: true,
        sortKey: linkConfig.sortKey,
        filter: linkConfig.nestedFilterKey ? { type: 'text', nestedKey: linkConfig.nestedFilterKey } : { type: 'text' },
        link: {
            href: linkConfig.href,
            label: linkConfig.label
        },
        meta: {
            style: {
                th: `width: ${width}`,
                td: `width: ${width}`
            }
        }
    }
}

export interface ParentEntityConfig {
    parentId?: string
    parentPath: string
    filterKey: string
}

export function computeReturnUrl(config: ParentEntityConfig, customReturnUrl?: string): string {
    if (customReturnUrl) return customReturnUrl
    if (config.parentId) return `${config.parentPath}/${config.parentId}`
    return ''
}

export function computeCreateQueryParams(config: ParentEntityConfig): Record<string, string> {
    const params: Record<string, string> = {}
    if (config.parentId) {
        params[config.filterKey] = config.parentId
    }
    return params
}

export function addParentFilter<T>(
    query: { filter?: [string, unknown][] },
    config: ParentEntityConfig
): void {
    if (config.parentId) {
        query.filter = query.filter || []
        query.filter.push([config.filterKey, { op: 'eq', value: config.parentId }])
    }
}
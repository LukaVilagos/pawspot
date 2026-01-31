import type { TableColumn, ButtonProps } from '@nuxt/ui'
import type { TypedTableColumn } from '~/types/table-types'
import type { SortingState } from './useTableState'
import type { Component, VNode } from 'vue'

export interface TableColumnsOptions<T> {
    columns: TypedTableColumn<T>[]
    sorting: Ref<SortingState[]>
    onSortToggle: (id: string, sortKey?: string) => void
    showActions?: boolean
    actionsColumn?: TableColumn<T>
}

export function useTableColumns<T extends Record<string, unknown>>(options: TableColumnsOptions<T>) {
    const UButton = resolveComponent('UButton')
    const NuxtLink = resolveComponent('NuxtLink')

    const tableColumns = computed<TableColumn<T>[]>(() => {
        const cols: TableColumn<T>[] = options.columns.map(col => {
            const column: TableColumn<T> = {
                accessorKey: col.accessorKey as string,
            }

            if (col.link) {
                const linkConfig = col.link
                column.cell = (info) => {
                    const href = linkConfig.href(info.row.original)
                    const label = linkConfig.label(info.row.original)
                    if (!href) return label
                    return h(NuxtLink as Component, {
                        to: href,
                        class: 'text-primary hover:text-primary/80 hover:underline cursor-pointer transition-colors'
                    }, () => label)
                }
            } else if (col.cell) {
                column.cell = col.cell as never
            }

            if (col.sortable) {
                column.enableSorting = false
                column.header = () => {
                    const sortEntry = options.sorting.value.find(s => s.id === (col.accessorKey as string))
                    const isSorted = sortEntry ? (sortEntry.desc ? 'desc' : 'asc') : false

                    return h(UButton as Component, {
                        color: 'neutral',
                        variant: 'ghost',
                        label: col.header,
                        icon: isSorted
                            ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow')
                            : 'i-lucide-arrow-up-down',
                        class: '-mx-2.5',
                        onClick: () => options.onSortToggle(col.accessorKey as string, col.sortKey)
                    } as ButtonProps)
                }
            } else {
                column.header = col.header
            }

            if (col.meta) {
                column.meta = col.meta
            }

            return column
        })

        if (options.showActions !== false && options.actionsColumn) {
            cols.push(options.actionsColumn)
        }

        return cols
    })

    return { tableColumns }
}

export function createActionsColumn<T extends Record<string, unknown>>(config: {
    variant: 'default' | 'relation'
    onDelete: (id: string) => void
    actionsURLBase?: string
    returnUrl?: string
    additionalItems?: unknown[][]
}): TableColumn<T> {
    const UButton = resolveComponent('UButton')
    const TableActions = resolveComponent('TableActions')

    return {
        accessorKey: 'actions',
        header: 'Actions',
        meta: {
            style: {
                th: 'width: 10%',
                td: 'width: 10%'
            }
        },
        cell: (info) => {
            const rowId = String((info.row.original as unknown as Record<string, unknown>).id)
            if (config.variant === 'relation') {
                return h(UButton as Component, {
                    size: 'xs',
                    color: 'error',
                    variant: 'ghost',
                    icon: 'i-lucide-trash-2',
                    onClick: () => config.onDelete(rowId),
                })
            }
            return h(TableActions as Component, {
                id: rowId,
                basePath: config.actionsURLBase,
                returnUrl: config.returnUrl,
                deleteMethod: async () => config.onDelete(rowId),
                additionalItems: config.additionalItems
            })
        }
    }
}

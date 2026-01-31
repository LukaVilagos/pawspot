import type { QueryOptions, SortEntry, FilterEntry, FilterCondition, NestedKeyOf } from '@pawspot/api-contracts'

type Primitive = string | number | boolean | Date | null | undefined
export type FilterValue = Primitive | FilterCondition | null

export interface ColumnFilter {
    id: string
    value: FilterValue
    filterKey?: string
}

export interface SortingState {
    id: string
    desc: boolean
    sortKey?: string
}

export interface UseTableStateOptions {
    tableId?: string
    pageSize?: number
    syncWithUrl?: boolean
}

export function useTableState<T>(options: UseTableStateOptions = {}) {
    const { tableId = '', pageSize = 10, syncWithUrl = true } = options

    const route = useRoute()
    const router = useRouter()

    const sorting = ref<SortingState[]>([])
    const columnFilters = ref<ColumnFilter[]>([])
    const isInitializing = ref(true)
    const currentPage = ref(1)

    const getQueryKey = (key: string) => tableId ? `${tableId}_${key}` : key
    const filtersKey = computed(() => getQueryKey('filters'))
    const sortQueryKey = computed(() => getQueryKey('sort'))
    const pageKey = computed(() => getQueryKey('page'))

    const hasActiveFilters = computed(() => columnFilters.value.length > 0)
    const hasActiveSorting = computed(() => sorting.value.length > 0)

    function isValidFilterValue(value: FilterValue): value is Exclude<FilterValue, null> {
        if (value === undefined || value === null || value === '') {
            return false
        }
        if (typeof value === 'object' && 'op' in value) {
            return value.value !== undefined && value.value !== ''
        }
        return true
    }

    function getFilterValueFromURL(field: string): FilterCondition | null {
        const filter = columnFilters.value.find(f => f.id === field)
        if (!filter || !filter.value) return null
        if (typeof filter.value === 'object' && filter.value !== null && 'op' in filter.value) {
            return filter.value as FilterCondition
        }
        return null
    }

    function setFilterValue(id: string, value: FilterValue, filterKey?: string) {
        if (isInitializing.value) return
        const idx = columnFilters.value.findIndex(f => f.id === id)
        if (!isValidFilterValue(value)) {
            if (idx !== -1) columnFilters.value.splice(idx, 1)
        } else {
            if (idx === -1) {
                columnFilters.value.push({ id, value, filterKey })
            } else {
                const filter = columnFilters.value[idx]
                if (filter) {
                    filter.value = value
                    filter.filterKey = filterKey
                }
            }
        }
    }

    function clearAllFilters() {
        columnFilters.value = []
    }

    function clearAllSorting() {
        sorting.value = []
    }

    function toggleSortingKey(id: string, sortKey?: string) {
        if (isInitializing.value) return

        const idx = sorting.value.findIndex(s => s.id === id)

        if (idx === -1) {
            sorting.value = [{ id, desc: false, sortKey }]
            return
        }

        const current = sorting.value[idx]
        if (current && !current.desc) {
            sorting.value = [{ id, desc: true, sortKey }]
            return
        }

        sorting.value = sorting.value.filter(s => s.id !== id)
    }

    function buildFilterPayload(page?: number): QueryOptions<T> {
        const q: QueryOptions<T> = {
            page: page ?? currentPage.value,
            limit: pageSize,
        }

        const filters = columnFilters.value
            .filter((f): f is ColumnFilter & { value: Exclude<FilterValue, null> } =>
                isValidFilterValue(f.value)
            )
            .map((f): FilterEntry<T> => {
                const key = (f.filterKey || f.id) as NestedKeyOf<T>
                return [key, f.value]
            })

        if (filters.length > 0) {
            q.filter = filters
        }

        const sort: SortEntry<T>[] = sorting.value.map((s: SortingState) => ({
            key: (s.sortKey || s.id) as NestedKeyOf<T>,
            order: s.desc ? 'desc' : 'asc'
        }))

        if (sort.length > 0) {
            q.sort = sort
        }

        return q
    }

    function initializeFromURL() {
        if (!syncWithUrl) {
            isInitializing.value = false
            return
        }

        const filtersParam = route.query[filtersKey.value]
        if (filtersParam && typeof filtersParam === 'string') {
            try {
                const parsedFilters = JSON.parse(filtersParam) as ColumnFilter[]
                columnFilters.value = parsedFilters
            } catch {
            }
        }

        const sortParam = route.query[sortQueryKey.value]
        if (sortParam && typeof sortParam === 'string') {
            try {
                const parsedSort = JSON.parse(sortParam) as SortingState[]
                sorting.value = parsedSort
            } catch {
            }
        }

        const pageParam = route.query[pageKey.value]
        if (pageParam) {
            currentPage.value = Number(pageParam) || 1
        }
    }

    function updateURL(payload: QueryOptions<T>) {
        if (!syncWithUrl) return

        const query: Record<string, string | undefined> = { ...route.query } as Record<string, string | undefined>

        delete query[pageKey.value]
        delete query[filtersKey.value]
        delete query[sortQueryKey.value]

        if (payload.page && payload.page > 1) {
            query[pageKey.value] = String(payload.page)
        }
        if (payload.filter && payload.filter.length > 0) {
            query[filtersKey.value] = JSON.stringify(columnFilters.value)
        }
        if (payload.sort && payload.sort.length > 0) {
            query[sortQueryKey.value] = JSON.stringify(sorting.value)
        }
        router.replace({ query })
    }

    function setPage(page: number) {
        currentPage.value = page
    }

    function resetState() {
        sorting.value = []
        columnFilters.value = []
        currentPage.value = 1
    }

    function finishInitialization() {
        isInitializing.value = false
    }

    return {
        sorting,
        columnFilters,
        isInitializing,
        currentPage,
        hasActiveFilters,
        hasActiveSorting,
        getFilterValueFromURL,
        setFilterValue,
        clearAllFilters,
        clearAllSorting,
        toggleSortingKey,
        buildFilterPayload,
        initializeFromURL,
        updateURL,
        setPage,
        resetState,
        finishInitialization,
    }
}

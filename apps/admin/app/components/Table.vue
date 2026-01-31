<template>
  <UPage>
    <UPageHeader v-if="showHeader" :headline="headline" :title="title" :description="description"
      :links="headerLinks" />
    <div v-else-if="headerLinks.length > 0" class="flex justify-end gap-2 px-4 py-2.5">
      <UButton v-for="(link, index) in headerLinks" :key="index" v-bind="link" />
    </div>
    <UPageBody>
      <div>
        <div v-if="showFilter" class="flex gap-2 items-center px-4 py-2.5 border-b border-accented overflow-x-auto">
          <div class="flex gap-2 flex-1">
            <template v-for="col in columns" :key="`filter-${col.accessorKey}`">
              <FilterInput v-if="col.filter" :key="`filter-input-${col.accessorKey}`" :filter-config="col.filter"
                :label="col.header" :field="col.accessorKey" :id="col.accessorKey"
                :model-value="getFilterValueFromURL(col.accessorKey)"
                @update="(value: FilterValue) => setFilterValue(col.accessorKey, value, col.filter?.nestedKey)"
                size="sm" />
            </template>
          </div>
          <UButton v-if="hasActiveFilters" color="neutral" variant="outline" label="Clear Filters" icon="i-lucide-x"
            @click="clearAllFilters" />
          <UButton v-if="hasActiveSorting" color="neutral" variant="outline" label="Clear Sorting" icon="i-lucide-x"
            @click="clearAllSorting" />
        </div>
        <UTable ref="table" :data="data" :columns="tableColumns" :sticky="sticky" :loading="loading"
          class="flex-1 w-full" :ui="{ base: 'table-fixed' }">
          <template #empty>
            <div class="py-6 text-center text-sm text-muted">
              No data
            </div>
          </template>
        </UTable>

        <DeleteItemModal v-model="showDelete" :item-name="entityName" @confirm="onConfirmDelete" />
        <div class="flex flex-row justify-center">
          <UPagination class="mt-4 self-center" :total="total" :page="page" :items-per-page="pageSize"
            @update:page="handlePageChange" />
        </div>
      </div>
    </UPageBody>
  </UPage>
</template>


<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { QueryOptions, SortEntry, FilterEntry, FilterCondition, NestedKeyOf } from '@pawspot/api-contracts'
import type { TypedTableColumn } from '~/types/table-types'
import type { DropdownMenuItem, ButtonProps, TableColumn } from '@nuxt/ui'

const UButton = resolveComponent('UButton')
const TableActions = resolveComponent('TableActions')

type Primitive = string | number | boolean | Date | null | undefined

type FilterValue = Primitive | FilterCondition | null

interface ColumnFilter {
  id: string
  value: FilterValue
  /** The actual key to use for filtering (may be nested like 'owner.name') */
  filterKey?: string
}

interface SortingState {
  id: string
  desc: boolean
  /** The actual key to use for sorting (may be nested like 'owner.name') */
  sortKey?: string
}

const props = withDefaults(defineProps<{
  data: T[]
  columns: TypedTableColumn<T>[]
  pageSize: number
  showFilter: boolean
  sticky: boolean
  total: number
  page: number
  entityName: string
  loadData: (query: QueryOptions<T>) => Promise<void>
  actionsURLBase: string
  deleteMethod: (id: string) => Promise<boolean>
  additionalTableActions?: DropdownMenuItem[][]
  loading?: boolean
  createQueryParams?: Record<string, string>
  /** Optional: Set to false to hide the header section */
  showHeader?: boolean
  /** Optional: Custom headline for the header */
  headline?: string
  /** Optional: Custom title for the header (defaults to entityName) */
  title?: string
  /** Optional: Custom description for the header */
  description?: string
  /** Optional: Unique identifier for this table, used to prefix URL query params when multiple tables are on the same page */
  tableId?: string
  /** Optional: URL to return to after create/edit/delete operations. If not provided, standard navigation is used. */
  returnUrl?: string
}>(), {
  createQueryParams: () => ({}),
  showHeader: true,
  headline: 'Management',
  title: undefined,
  description: 'Manage your items',
  tableId: '',
  returnUrl: ''
})

const emit = defineEmits<{
  (e: 'filter-change', payload: QueryOptions<T>): void
}>()

const route = useRoute()
const router = useRouter()

const sorting = ref<SortingState[]>([])
const columnFilters = ref<ColumnFilter[]>([])
const isInitializing = ref(true)

const showDelete = ref(false)
const selectedDeleteId = ref<string | null>(null)

const PAGE_SIZE = 10

const headline = computed(() => props.headline)
const title = computed(() => props.title ?? props.entityName)
const description = computed(() => props.description)

const getQueryKey = (key: string) => props.tableId ? `${props.tableId}_${key}` : key
const filtersKey = computed(() => getQueryKey('filters'))
const sortQueryKey = computed(() => getQueryKey('sort'))
const pageKey = computed(() => getQueryKey('page'))

const createUrl = computed(() => {
  const baseUrl = `${props.actionsURLBase}/create`
  const params = new URLSearchParams(props.createQueryParams)
  if (props.returnUrl) {
    params.set('returnUrl', props.returnUrl)
  }
  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
})

const headerLinks = ref<ButtonProps[]>([
  {
    label: 'Create',
    icon: 'mdi-plus',
    color: 'primary',
    onClick: () => {
      router.push(createUrl.value)
    },
  },
])

const actionsColumn: TableColumn<T> = {
  accessorKey: 'actions',
  header: 'Actions',
  meta: {
    style: {
      th: 'width: 10%',
      td: 'width: 10%'
    }
  },
  cell: (info) => {
    return h(TableActions, {
      id: info.row.original.id,
      basePath: props.actionsURLBase,
      returnUrl: props.returnUrl,
      deleteMethod: async () => {
        selectedDeleteId.value = info.row.original.id as string
        showDelete.value = true
      },
      additionalItems: props.additionalTableActions
    })
  }
}

const NuxtLink = resolveComponent('NuxtLink')

const tableColumns = computed<TableColumn<T>[]>(() => {
  const cols: TableColumn<T>[] = props.columns.map(col => {
    const column: TableColumn<T> = {
      accessorKey: col.accessorKey as string,
    }

    if (col.link) {
      const linkConfig = col.link
      column.cell = (info) => {
        const href = linkConfig.href(info.row.original)
        const label = linkConfig.label(info.row.original)
        if (!href) return label
        return h(NuxtLink, {
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
        const sortEntry = sorting.value.find(s => s.id === (col.accessorKey as string))
        const isSorted = sortEntry ? (sortEntry.desc ? 'desc' : 'asc') : false

        return h(UButton, {
          color: 'neutral',
          variant: 'ghost',
          label: col.header,
          icon: isSorted
            ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow')
            : 'i-lucide-arrow-up-down',
          class: '-mx-2.5',
          onClick: () => toggleSortingKey(col.accessorKey as string, col.sortKey)
        })
      }
    } else {
      column.header = col.header
    }

    if (col.meta) {
      column.meta = col.meta
    }

    return column
  })

  cols.push(actionsColumn)

  return cols
})

const hasActiveFilters = computed(() => columnFilters.value.length > 0)
const hasActiveSorting = computed(() => sorting.value.length > 0)

function getFilterValueFromURL(field: string): FilterCondition | null {
  const filter = columnFilters.value.find(f => f.id === field)
  if (!filter || !filter.value) return null
  if (typeof filter.value === 'object' && filter.value !== null && 'op' in filter.value) {
    return filter.value as FilterCondition
  }
  return null
}

function clearAllFilters() {
  columnFilters.value = []
}

function clearAllSorting() {
  sorting.value = []
}

onMounted(() => {
  initializeFromURL()
  nextTick(() => {
    isInitializing.value = false
  })
})

onMounted(async () => {
  const hasUrlParams = route.query[filtersKey.value] || route.query[sortQueryKey.value] || route.query[pageKey.value]

  if (!hasUrlParams) {
    await props.loadData({ page: 1, limit: PAGE_SIZE })
  }
})

function initializeFromURL() {
  const filtersParam = route.query[filtersKey.value]
  if (filtersParam && typeof filtersParam === 'string') {
    try {
      const parsedFilters = JSON.parse(filtersParam) as ColumnFilter[]
      columnFilters.value = parsedFilters
    } catch (e) {
      console.error('Failed to parse filters from URL', e)
    }
  }

  const sortParam = route.query[sortQueryKey.value]
  if (sortParam && typeof sortParam === 'string') {
    try {
      const parsedSort = JSON.parse(sortParam) as SortingState[]
      sorting.value = parsedSort
    } catch (e) {
      console.error('Failed to parse sort from URL', e)
    }
  }

  const pageParam = route.query[pageKey.value]
  if (filtersParam || sortParam || pageParam) {
    const payload = buildFilterPayload()
    payload.page = Number(pageParam) || 1
    emit('filter-change', payload)
  }
}

function updateURL(payload: QueryOptions<T>) {
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

function handlePageChange(newPage: number) {
  if (isInitializing.value) return
  const payload = buildFilterPayload()
  payload.page = newPage
  updateURL(payload)
  emit('filter-change', payload)
}

function isValidFilterValue(value: FilterValue): value is Exclude<FilterValue, null> {
  if (value === undefined || value === null || value === '') {
    return false
  }
  if (typeof value === 'object' && 'op' in value) {
    return value.value !== undefined && value.value !== ''
  }
  return true
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

function buildFilterPayload(): QueryOptions<T> {
  const q: QueryOptions<T> = {
    page: Number(route.query[pageKey.value]) || props.page || 1,
    limit: props.pageSize,
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

const debounceMs = 350
let filterTimer: number | undefined

function scheduleEmitFilterChange(payload: QueryOptions<T>) {
  if (filterTimer) window.clearTimeout(filterTimer)
  filterTimer = window.setTimeout(() => {
    updateURL(payload)
    emit('filter-change', payload)
  }, debounceMs)
}

watch(
  [columnFilters, sorting],
  () => {
    if (isInitializing.value) return
    const payload = buildFilterPayload()
    payload.page = 1
    scheduleEmitFilterChange(payload)
  },
  { deep: true }
)

async function onConfirmDelete() {
  if (!selectedDeleteId.value) return

  try {
    const success = await props.deleteMethod(selectedDeleteId.value)
    if (success) {
      const currentPage = Number(route.query[pageKey.value]) || props.page || 1
      const isLastItemOnPage = props.data.length === 1
      const shouldGoToPreviousPage = isLastItemOnPage && currentPage > 1

      const payload = buildFilterPayload()
      payload.page = shouldGoToPreviousPage ? currentPage - 1 : currentPage

      if (shouldGoToPreviousPage) {
        updateURL(payload)
      }

      await props.loadData(payload)
    }
  } catch (e) {
    console.error('Failed to delete item', e)
  } finally {
    selectedDeleteId.value = null
    showDelete.value = false
  }
}
</script>
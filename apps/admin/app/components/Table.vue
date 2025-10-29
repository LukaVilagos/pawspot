<template>
  <UPage>
    <UPageHeader headline="User Management" :title="entityName" description="Manage your users" />
    <UPageBody>
      <div>
        <div v-if="showFilter" class="flex gap-2 items-center px-4 py-2.5 border-b border-accented overflow-x-auto">
          <div class="flex gap-2 flex-1">
            <template v-for="col in columns" :key="col.accessorKey">
              <FilterInput v-if="col.filter" :filter-config="col.filter" :label="col.header" :field="col.accessorKey"
                :id="col.accessorKey" :model-value="getFilterValueFromURL(col.accessorKey)"
                @update="(value: FilterValue) => setFilterValue(col.accessorKey, value)" />
            </template>
          </div>
          <UButton v-if="hasActiveFilters" color="neutral" variant="outline" label="Clear Filters" icon="i-lucide-x"
            @click="clearAllFilters" />
          <UButton v-if="hasActiveSorting" color="neutral" variant="outline" label="Clear Sorting" icon="i-lucide-x"
            @click="clearAllSorting" />
        </div>
        <UTable ref="table" :data="data" :columns="tableColumns" :sticky="sticky" :loading="loading"
          class="flex-1 w-full" :ui="{ base: 'table-fixed' }" />

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
import type { TableColumn } from '@nuxt/ui'
import type { DropdownMenuItem } from '@nuxt/ui'

const UButton = resolveComponent('UButton')
const TableActions = resolveComponent('TableActions')

type Primitive = string | number | boolean | Date | null | undefined

type FilterValue = Primitive | FilterCondition | null

interface ColumnFilter {
  id: string
  value: FilterValue
}

interface SortingState {
  id: string
  desc: boolean
}

const props = defineProps<{
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
}>()

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
      deleteMethod: async () => {
        selectedDeleteId.value = info.row.original.id as string
        showDelete.value = true
      },
      additionalItems: props.additionalTableActions
    })
  }
}

const tableColumns = computed<TableColumn<T>[]>(() => {
  const cols: TableColumn<T>[] = props.columns.map(col => {
    const column: TableColumn<T> = {
      accessorKey: col.accessorKey as string,
      cell: col.cell as never,
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
          onClick: () => toggleSortingKey(col.accessorKey as string)
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
  const hasUrlParams = route.query.filters || route.query.sort || route.query.page

  if (!hasUrlParams && !props.data.length) {
    await props.loadData({ page: 1, limit: PAGE_SIZE })
  }
})

function initializeFromURL() {
  const filtersParam = route.query.filters
  if (filtersParam && typeof filtersParam === 'string') {
    try {
      const parsedFilters = JSON.parse(filtersParam) as ColumnFilter[]
      columnFilters.value = parsedFilters
    } catch (e) {
      console.error('Failed to parse filters from URL', e)
    }
  }

  const sortParam = route.query.sort
  if (sortParam && typeof sortParam === 'string') {
    try {
      const parsedSort = JSON.parse(sortParam) as SortingState[]
      sorting.value = parsedSort
    } catch (e) {
      console.error('Failed to parse sort from URL', e)
    }
  }

  if (filtersParam || sortParam || route.query.page) {
    const payload = buildFilterPayload()
    payload.page = Number(route.query.page) || 1
    emit('filter-change', payload)
  }
}

function updateURL(payload: QueryOptions<T>) {
  const query: Record<string, string> = {}
  if (payload.page && payload.page > 1) {
    query.page = String(payload.page)
  }
  if (payload.filter && payload.filter.length > 0) {
    query.filters = JSON.stringify(columnFilters.value)
  }
  if (payload.sort && payload.sort.length > 0) {
    query.sort = JSON.stringify(sorting.value)
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

function setFilterValue(id: string, value: FilterValue) {
  if (isInitializing.value) return
  const idx = columnFilters.value.findIndex(f => f.id === id)
  if (!isValidFilterValue(value)) {
    if (idx !== -1) columnFilters.value.splice(idx, 1)
  } else {
    if (idx === -1) {
      columnFilters.value.push({ id, value })
    } else {
      const filter = columnFilters.value[idx]
      if (filter) {
        filter.value = value
      }
    }
  }
}

function buildFilterPayload(): QueryOptions<T> {
  const q: QueryOptions<T> = {
    page: Number(route.query.page) || props.page || 1,
    limit: props.pageSize,
  }

  const filters = columnFilters.value
    .filter((f): f is ColumnFilter & { value: Exclude<FilterValue, null> } =>
      isValidFilterValue(f.value)
    )
    .map((f): FilterEntry<T> => [f.id as NestedKeyOf<T>, f.value])

  if (filters.length > 0) {
    q.filter = filters
  }

  const sort: SortEntry<T>[] = sorting.value.map((s: SortingState) => ({
    key: s.id as NestedKeyOf<T>,
    order: s.desc ? 'desc' : 'asc'
  }))

  if (sort.length > 0) {
    q.sort = sort
  }

  return q
}

function toggleSortingKey(id: string) {
  if (isInitializing.value) return

  const idx = sorting.value.findIndex(s => s.id === id)

  if (idx === -1) {
    sorting.value = [{ id, desc: false }]
    return
  }

  const current = sorting.value[idx]
  if (current && !current.desc) {
    sorting.value = [{ id, desc: true }]
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

const table = ref()

async function onConfirmDelete() {
  if (!selectedDeleteId.value) return

  try {
    const success = await props.deleteMethod(selectedDeleteId.value)
    // Optionally reload data if deletion succeeded
    if (success) {
      // rebuild current payload and load
      const payload = buildFilterPayload()
      payload.page = Number(route.query.page) || props.page || 1
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
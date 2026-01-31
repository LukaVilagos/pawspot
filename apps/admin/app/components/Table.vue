<template>
  <component :is="variant === 'relation' ? 'div' : UPage">
    <UPageHeader v-if="showHeader && variant !== 'relation'" :headline="computedHeadline" :title="computedTitle"
      :description="computedDescription" :links="computedHeaderLinks" />
    <div v-else-if="variant === 'relation'" class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">{{ computedTitle }}</h3>
      <UButton v-if="showCreateButton" label="Add" icon="i-lucide-plus" color="primary" size="sm"
        @click="handleCreateClick" />
    </div>
    <div v-else-if="computedHeaderLinks.length > 0" class="flex justify-end gap-2 px-4 py-2.5">
      <UButton v-for="(link, index) in computedHeaderLinks" :key="index" v-bind="link" />
    </div>
    <component :is="variant === 'relation' ? 'div' : UPageBody">
      <div>
        <div v-if="showFilter" class="flex gap-2 items-center px-4 py-2.5 border-b border-accented overflow-x-auto">
          <div class="flex gap-2 flex-1">
            <template v-for="col in columns" :key="`filter-${col.accessorKey}`">
              <FilterInput v-if="col.filter" :filter-config="col.filter" :label="col.header" :field="col.accessorKey"
                :id="col.accessorKey" :model-value="tableState.getFilterValueFromURL(col.accessorKey)"
                @update="(value: FilterValue) => tableState.setFilterValue(col.accessorKey, value, col.filter?.nestedKey)"
                size="sm" />
            </template>
          </div>
          <UButton v-if="tableState.hasActiveFilters.value" color="neutral" variant="outline" label="Clear Filters"
            icon="i-lucide-x" @click="tableState.clearAllFilters" />
          <UButton v-if="tableState.hasActiveSorting.value" color="neutral" variant="outline" label="Clear Sorting"
            icon="i-lucide-x" @click="tableState.clearAllSorting" />
        </div>
        <UTable ref="table" :data="data" :columns="computedTableColumns" :sticky="sticky" :loading="loading"
          class="flex-1 w-full" :ui="{ base: 'table-fixed' }">
          <template #empty>
            <div class="py-6 text-center text-sm text-muted">
              {{ emptyMessage }}
            </div>
          </template>
        </UTable>

        <DeleteItemModal v-model="showDelete" :item-name="computedDeleteItemName" @confirm="onConfirmDelete" />
        <div class="flex flex-row items-center justify-between mt-4 px-4">
          <span class="text-sm text-muted">Total: {{ total }} {{ entityName.toLowerCase() }}{{ total !== 1 ? 's' : ''
            }}</span>
          <UPagination v-if="Math.ceil(total / pageSize) > 1" :page="page" :total="total" :items-per-page="pageSize"
            @update:page="handlePageChange" />
          <span v-else class="flex-1"></span>
          <span class="text-sm text-muted w-[100px]"></span>
        </div>
      </div>
    </component>
  </component>
</template>


<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { QueryOptions } from '@pawspot/api-contracts'
import type { TypedTableColumn } from '~/types/table-types'
import type { DropdownMenuItem, ButtonProps, TableColumn } from '@nuxt/ui'
import type { FilterValue } from '~/composables/useTableState'
import type { Component } from 'vue'

const UButton = resolveComponent('UButton')
const TableActions = resolveComponent('TableActions')
const UPage = resolveComponent('UPage')
const UPageBody = resolveComponent('UPageBody')

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
  actionsURLBase?: string
  deleteMethod?: (id: string) => Promise<boolean>
  additionalTableActions?: DropdownMenuItem[][]
  loading?: boolean
  createQueryParams?: Record<string, string>
  showHeader?: boolean
  headline?: string
  title?: string
  description?: string
  tableId?: string
  returnUrl?: string
  variant?: 'default' | 'relation'
  emptyMessage?: string
  showCreateButton?: boolean
  deleteItemName?: string
  showActions?: boolean
  onRowDelete?: (id: string) => Promise<void>
  syncUrlState?: boolean
  showEditAction?: boolean
}>(), {
  createQueryParams: () => ({}),
  showHeader: true,
  headline: 'Management',
  title: undefined,
  description: 'Manage your items',
  tableId: '',
  returnUrl: '',
  variant: 'default',
  emptyMessage: 'No data',
  showCreateButton: true,
  deleteItemName: undefined,
  showActions: true,
  actionsURLBase: '',
  deleteMethod: undefined,
  onRowDelete: undefined,
  syncUrlState: true,
  showEditAction: true
})

const emit = defineEmits<{
  (e: 'filter-change', payload: QueryOptions<T>): void
  (e: 'create-click'): void
}>()

const router = useRouter()

const tableState = useTableState<T>({
  tableId: props.tableId,
  pageSize: props.pageSize,
  syncWithUrl: props.syncUrlState
})

const showDelete = ref(false)
const selectedDeleteId = ref<string | null>(null)

const computedHeadline = computed(() => props.headline)
const computedTitle = computed(() => props.title ?? props.entityName)
const computedDescription = computed(() => props.description)
const computedDeleteItemName = computed(() => props.deleteItemName ?? props.entityName)

const createUrl = computed(() => {
  const baseUrl = `${props.actionsURLBase}/create`
  const params = new URLSearchParams(props.createQueryParams)
  if (props.returnUrl) {
    params.set('returnUrl', props.returnUrl)
  }
  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
})

function handleCreateClick() {
  if (props.variant === 'relation') {
    emit('create-click')
  } else {
    router.push(createUrl.value)
  }
}

const computedHeaderLinks = computed<ButtonProps[]>(() => {
  if (!props.showCreateButton) return []
  return [
    {
      label: props.variant === 'relation' ? 'Add' : 'Create',
      icon: 'mdi-plus',
      color: 'primary' as const,
      onClick: handleCreateClick,
    },
  ]
})

function handleDeleteClick(id: string) {
  selectedDeleteId.value = id
  showDelete.value = true
}

const actionsColumn = computed<TableColumn<T>>(() => ({
  accessorKey: 'actions',
  header: 'Actions',
  meta: {
    style: {
      th: 'width: 10%',
      td: 'width: 10%'
    }
  },
  cell: (info) => {
    return h(TableActions as Component, {
      id: info.row.original.id,
      basePath: props.actionsURLBase,
      returnUrl: props.returnUrl,
      deleteMethod: async () => handleDeleteClick(info.row.original.id as string),
      additionalItems: props.additionalTableActions,
      showEdit: props.showEditAction
    })
  }
}))

const NuxtLink = resolveComponent('NuxtLink')

const columnWidthPercent = computed(() => {
  const totalCols = props.columns.length + (props.showActions ? 1 : 0)
  const actionsWidth = props.showActions ? 10 : 0
  const remainingWidth = 100 - actionsWidth
  return Math.floor(remainingWidth / props.columns.length)
})

const computedTableColumns = computed<TableColumn<T>[]>(() => {
  const cols: TableColumn<T>[] = props.columns.map((col, index) => {
    const column: TableColumn<T> = {
      accessorKey: col.accessorKey as string,
    }

    const defaultWidthStyle = `width: ${columnWidthPercent.value}%`
    if (!col.meta?.style?.th && !col.meta?.style?.td) {
      column.meta = {
        ...col.meta,
        style: {
          th: defaultWidthStyle,
          td: defaultWidthStyle,
          ...col.meta?.style
        }
      }
    } else if (col.meta) {
      column.meta = col.meta
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
        const sortEntry = tableState.sorting.value.find(s => s.id === (col.accessorKey as string))
        const isSorted = sortEntry ? (sortEntry.desc ? 'desc' : 'asc') : false

        return h(UButton as Component, {
          color: 'neutral',
          variant: 'ghost',
          label: col.header,
          icon: isSorted
            ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow')
            : 'i-lucide-arrow-up-down',
          class: '-mx-2.5',
          onClick: () => tableState.toggleSortingKey(col.accessorKey as string, col.sortKey)
        })
      }
    } else {
      column.header = col.header
    }

    return column
  })

  if (props.showActions) {
    cols.push(actionsColumn.value)
  }

  return cols
})

onMounted(() => {
  tableState.initializeFromURL()
  nextTick(async () => {
    tableState.finishInitialization()

    if (props.syncUrlState) {
      const payload = tableState.buildFilterPayload()
      emit('filter-change', payload)
    } else {
      await props.loadData({ page: 1, limit: props.pageSize })
    }
  })
})

function handlePageChange(newPage: number) {
  if (tableState.isInitializing.value) return
  tableState.setPage(newPage)
  const payload = tableState.buildFilterPayload(newPage)
  tableState.updateURL(payload)
  emit('filter-change', payload)
}

const debounceMs = 350
let filterTimer: number | undefined

function scheduleEmitFilterChange(payload: QueryOptions<T>) {
  if (filterTimer) window.clearTimeout(filterTimer)
  filterTimer = window.setTimeout(() => {
    tableState.updateURL(payload)
    emit('filter-change', payload)
  }, debounceMs)
}

watch(
  [tableState.columnFilters, tableState.sorting],
  () => {
    if (tableState.isInitializing.value) return
    tableState.setPage(1)
    const payload = tableState.buildFilterPayload(1)
    scheduleEmitFilterChange(payload)
  },
  { deep: true }
)

async function onConfirmDelete() {
  if (!selectedDeleteId.value) return

  try {
    if (props.variant === 'relation' && props.onRowDelete) {
      await props.onRowDelete(selectedDeleteId.value)
    } else if (props.deleteMethod) {
      const success = await props.deleteMethod(selectedDeleteId.value)
      if (success) {
        const route = useRoute()
        const pageKey = props.tableId ? `${props.tableId}_page` : 'page'
        const currentPage = Number(route.query[pageKey]) || props.page || 1
        const isLastItemOnPage = props.data.length === 1
        const shouldGoToPreviousPage = isLastItemOnPage && currentPage > 1

        const payload = tableState.buildFilterPayload(shouldGoToPreviousPage ? currentPage - 1 : currentPage)

        if (shouldGoToPreviousPage) {
          tableState.updateURL(payload)
        }

        await props.loadData(payload)
      }
    }
  } finally {
    selectedDeleteId.value = null
    showDelete.value = false
  }
}
</script>

<template>
    <div>
        <Table :data="data" :columns="columns" :page-size="pageSize" :show-filter="showFilter" :sticky="false"
            :total="total" :page="page" :entity-name="entityName" :load-data="loadData" :show-header="false"
            :show-create-button="canAdd" :show-actions="showActions" variant="relation" :title="title"
            :empty-message="emptyMessage" :delete-item-name="removeItemName" :on-row-delete="handleRemove"
            :loading="loading" :sync-url-state="false" :actions-u-r-l-base="actionsURLBase" :show-edit-action="false"
            @create-click="openAddModal" @filter-change="handleFilterChange" />

        <UModal v-model:open="showAddModal" title="Add Item">
            <template #body>
                <div class="space-y-4">
                    <UFormField :label="searchLabel">
                        <UInput v-model="searchQuery" :placeholder="searchPlaceholder" @input="debouncedSearch" />
                    </UFormField>
                    <p v-if="searchHint" class="text-xs text-gray-500">{{ searchHint }}</p>
                    <div class="h-[200px] relative">
                        <div v-if="isSearching" class="absolute inset-0 flex items-center justify-center">
                            <LoadingSpinner />
                        </div>
                        <div v-else-if="filteredSearchResults.length" class="h-full overflow-y-auto">
                            <div v-for="result in filteredSearchResults" :key="getItemIdFromResult(result)"
                                class="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer"
                                @click="selectItemFromResult(result)">
                                <span>{{ getDisplayValueFromResult(result) }}</span>
                                <UButton size="xs" color="primary" variant="ghost" icon="i-lucide-plus" />
                            </div>
                        </div>
                        <p v-else-if="searchQuery && !isSearching"
                            class="absolute inset-0 flex items-center justify-center text-gray-500">
                            No results found
                        </p>
                        <p v-else class="absolute inset-0 flex items-center justify-center text-gray-400">
                            Start typing to search
                        </p>
                    </div>
                </div>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { TypedTableColumn } from '~/types/table-types'
import type { QueryOptions } from '@pawspot/api-contracts'

interface Props {
    title: string
    data: T[]
    total: number
    page: number
    columns: TypedTableColumn<T>[]
    emptyMessage?: string
    searchLabel: string
    searchPlaceholder: string
    searchHint?: string
    displayKey: keyof T & string
    secondaryDisplayKey?: keyof T & string
    idKey?: string
    canAdd?: boolean
    canRemove?: boolean
    canView?: boolean
    showFilter?: boolean
    pageSize?: number
    entityName?: string
    actionsURLBase?: string
    loadData: (query: QueryOptions<T>) => Promise<void>
    searchFn: (query: string) => Promise<T[]>
    addFn: (itemId: string) => Promise<void>
    removeFn: (itemId: string) => Promise<void>
    removeItemName?: string
    loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    canAdd: true,
    canRemove: true,
    canView: true,
    showFilter: false,
    pageSize: 10,
    entityName: 'Item',
    emptyMessage: 'No data',
    removeItemName: 'Item',
    loading: false,
    idKey: 'id',
    actionsURLBase: '',
})

const showActions = computed(() => props.canRemove || props.canView)

const emit = defineEmits<{
    (e: 'added', item: T): void
    (e: 'removed', itemId: string): void
}>()

const showAddModal = ref(false)
const searchQuery = ref('')
const searchResults = ref<T[]>([])
const isSearching = ref(false)

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const idKeyName = computed(() => props.idKey)

const existingIds = computed(() => new Set(props.data.map(item => String((item as Record<string, unknown>)[idKeyName.value]))))

const filteredSearchResults = computed(() =>
    searchResults.value.filter(result => {
        const id = String((result as Record<string, unknown>)[idKeyName.value])
        return !existingIds.value.has(id)
    })
)

function getItemId(item: T): string {
    return String((item as Record<string, unknown>)[idKeyName.value])
}

function getItemIdFromResult(item: unknown): string {
    return String((item as Record<string, unknown>)[idKeyName.value])
}

function getDisplayValue(item: T): string {
    const rec = item as Record<string, unknown>
    const primary = rec[props.displayKey]
    const secondary = props.secondaryDisplayKey ? rec[props.secondaryDisplayKey] : null
    if (primary && secondary) return `${primary} (${secondary})`
    return String(primary || secondary || getItemId(item))
}

function getDisplayValueFromResult(item: unknown): string {
    return getDisplayValue(item as T)
}

function openAddModal() {
    searchQuery.value = ''
    searchResults.value = []
    showAddModal.value = true
}

async function performSearch() {
    if (!searchQuery.value.trim()) {
        searchResults.value = []
        return
    }
    isSearching.value = true
    try {
        searchResults.value = await props.searchFn(searchQuery.value)
    } finally {
        isSearching.value = false
    }
}

function debouncedSearch() {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(performSearch, 300)
}

async function selectItem(item: T) {
    try {
        await props.addFn(getItemId(item))
        emit('added', item)
        showAddModal.value = false
    } catch {
    }
}

async function selectItemFromResult(item: unknown) {
    return selectItem(item as T)
}

async function handleRemove(itemId: string) {
    try {
        await props.removeFn(itemId)
        emit('removed', itemId)
    } catch {
    }
}

function handleFilterChange(query: QueryOptions<T>) {
    props.loadData(query)
}
</script>

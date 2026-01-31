<template>
    <Table :key="tableKey" :data="searchResult?.items || []" :columns="columns" :page-size="searchResult?.limit || 10"
        :total="searchResult?.total || 0" :page="searchResult?.page || 1" :loading="isLoading"
        @filter-change="loadAnimals" :show-filter="showFilter" :sticky="sticky" :load-data="loadAnimals"
        :actions-u-r-l-base="URLBase" :delete-method="animalStore.deleteAnimal" entityName="Animal"
        :create-query-params="createQueryParams" :show-header="showHeader" table-id="animal"
        :return-url="computedReturnUrl" />
</template>

<script setup lang="ts">
import { type AnimalResponse, type QueryOptions } from '@pawspot/api-contracts'
import type { TypedTableColumn } from '~/types/table-types'
import {
    createIdColumn,
    createTextColumn,
    createNumberColumn,
    createLinkColumn,
    createCreatedAtColumn,
    computeReturnUrl,
    computeCreateQueryParams,
    addParentFilter,
    type ParentEntityConfig
} from '~/utils/tableUtils'

const props = withDefaults(defineProps<{
    showFilter?: boolean
    sticky?: boolean
    sanctuaryId?: string
    showHeader?: boolean
    returnUrl?: string
}>(), {
    showFilter: true,
    sticky: true,
    showHeader: true,
    returnUrl: '',
})

const parentConfig = computed<ParentEntityConfig>(() => ({
    parentId: props.sanctuaryId,
    parentPath: '/sanctuary',
    filterKey: 'sanctuaryId'
}))

const computedReturnUrl = computed(() => computeReturnUrl(parentConfig.value, props.returnUrl))
const createQueryParams = computed(() => computeCreateQueryParams(parentConfig.value))

const animalStore = useAnimalStore()
const { searchResult, isLoading } = storeToRefs(animalStore)

const tableKey = computed(() => generateTableKey(searchResult.value))
const URLBase = '/animal'

async function loadAnimals(query: QueryOptions<AnimalResponse>): Promise<void> {
    addParentFilter(query, parentConfig.value)
    await animalStore.searchAnimals(query)
}

const baseColumns: TypedTableColumn<AnimalResponse>[] = [
    createIdColumn<AnimalResponse>('15%'),
    createTextColumn<AnimalResponse>('name', 'Name', '20%'),
    createTextColumn<AnimalResponse>('species', 'Species', '15%'),
    createNumberColumn<AnimalResponse>('age', 'Age', '10%'),
    createLinkColumn<AnimalResponse>('sanctuary', 'Sanctuary', '20%', {
        href: (row) => row.sanctuary ? `/sanctuary/${row.sanctuary.id}` : '',
        label: (row) => row.sanctuary?.name || '-',
        sortKey: 'sanctuary.name',
        nestedFilterKey: 'sanctuary.name'
    }),
    createCreatedAtColumn<AnimalResponse>('20%')
]

const columns = computed(() => {
    if (props.sanctuaryId) {
        return baseColumns.filter(col => col.accessorKey !== 'sanctuary')
    }
    return baseColumns
})
</script>

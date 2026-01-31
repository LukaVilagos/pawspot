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
const computedReturnUrl = computed(() => {
    if (props.returnUrl) return props.returnUrl
    if (props.sanctuaryId) return `/sanctuary/${props.sanctuaryId}`
    return ''
})

const animalStore = useAnimalStore()
const { searchResult, isLoading } = storeToRefs(animalStore)

const tableKey = computed(() => generateTableKey(searchResult.value))
const URLBase = '/animal'

const createQueryParams = computed(() => {
    const params: Record<string, string> = {}
    if (props.sanctuaryId) {
        params.sanctuaryId = props.sanctuaryId
    }
    return params
})

async function loadAnimals(query: QueryOptions<AnimalResponse>): Promise<void> {
    if (props.sanctuaryId) {
        query.filter = query.filter || []
        query.filter.push(['sanctuaryId', { op: 'eq', value: props.sanctuaryId }])
    }
    await animalStore.searchAnimals(query)
}

const baseColumns: TypedTableColumn<AnimalResponse>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        sortable: true,
        filter: { type: 'text' },
        meta: {
            style: {
                th: 'width: 15%',
                td: 'width: 15%'
            }
        }
    },
    {
        accessorKey: 'name',
        header: 'Name',
        sortable: true,
        filter: { type: 'text' },
        meta: {
            style: {
                th: 'width: 20%',
                td: 'width: 20%'
            }
        }
    },
    {
        accessorKey: 'species',
        header: 'Species',
        sortable: true,
        filter: { type: 'text' },
        meta: {
            style: {
                th: 'width: 15%',
                td: 'width: 15%'
            }
        }
    },
    {
        accessorKey: 'age',
        header: 'Age',
        sortable: true,
        filter: { type: 'number' },
        meta: {
            style: {
                th: 'width: 10%',
                td: 'width: 10%'
            }
        }
    },
    {
        accessorKey: 'sanctuary',
        header: 'Sanctuary',
        sortable: true,
        sortKey: 'sanctuary.name',
        filter: { type: 'text', nestedKey: 'sanctuary.name' },
        link: {
            href: (row) => row.sanctuary ? `/sanctuary/${row.sanctuary.id}` : '',
            label: (row) => row.sanctuary?.name || '-'
        },
        meta: {
            style: {
                th: 'width: 20%',
                td: 'width: 20%'
            }
        }
    },
    {
        accessorKey: 'createdAt',
        header: 'Created At',
        sortable: true,
        filter: { type: 'range' },
        meta: {
            style: {
                th: 'width: 20%',
                td: 'width: 20%'
            }
        }
    }
]

const columns = computed(() => {
    if (props.sanctuaryId) {
        return baseColumns.filter(col => col.accessorKey !== 'sanctuary')
    }
    return baseColumns
})
</script>

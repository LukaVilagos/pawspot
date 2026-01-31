<template>
    <Table :key="tableKey" :data="searchResult?.items || []" :columns="columns" :page-size="searchResult?.limit || 10"
        :total="searchResult?.total || 0" :page="searchResult?.page || 1" :loading="isLoading"
        @filter-change="loadSanctuaries" :show-filter="showFilter" :sticky="sticky" :load-data="loadSanctuaries"
        :actions-u-r-l-base="URLBase" :delete-method="sanctuaryStore.deleteSanctuary" entityName="Sanctuary"
        :show-header="showHeader" table-id="sanctuary" />
</template>

<script setup lang="ts">
import { type SanctuaryResponse, type QueryOptions } from '@pawspot/api-contracts'
import type { TypedTableColumn } from '~/types/table-types'

const props = withDefaults(defineProps<{
    showFilter?: boolean
    sticky?: boolean
    showHeader?: boolean
}>(), {
    showFilter: true,
    sticky: true,
    showHeader: true,
})

const sanctuaryStore = useSanctuaryStore()
const { searchResult, isLoading } = storeToRefs(sanctuaryStore)

const tableKey = computed(() => generateTableKey(searchResult.value))
const URLBase = '/sanctuary'

async function loadSanctuaries(query: QueryOptions<SanctuaryResponse>): Promise<void> {
    await sanctuaryStore.searchSanctuaries(query)
}

const columns: TypedTableColumn<SanctuaryResponse>[] = [
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
        accessorKey: 'location',
        header: 'Location',
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
        accessorKey: 'owner',
        header: 'Owner',
        sortable: true,
        sortKey: 'owner.name',
        filter: { type: 'text', nestedKey: 'owner.name' },
        link: {
            href: (row) => row.owner ? `/user/${row.owner.id}` : '',
            label: (row) => row.owner?.name || row.owner?.email || '-'
        },
        meta: {
            style: {
                th: 'width: 15%',
                td: 'width: 15%'
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
</script>

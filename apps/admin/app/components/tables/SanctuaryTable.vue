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
import {
    createIdColumn,
    createTextColumn,
    createLinkColumn,
    createCreatedAtColumn
} from '~/utils/tableUtils'

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
    createIdColumn<SanctuaryResponse>('15%'),
    createTextColumn<SanctuaryResponse>('name', 'Name', '20%'),
    createTextColumn<SanctuaryResponse>('location', 'Location', '20%'),
    createLinkColumn<SanctuaryResponse>('owner', 'Owner', '15%', {
        href: (row) => row.owner ? `/user/${row.owner.id}` : '',
        label: (row) => row.owner?.name || row.owner?.email || '-',
        sortKey: 'owner.name',
        nestedFilterKey: 'owner.name'
    }),
    createCreatedAtColumn<SanctuaryResponse>('20%')
]
</script>

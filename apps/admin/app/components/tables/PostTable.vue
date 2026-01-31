<template>
    <Table :key="tableKey" :data="searchResult?.items || []" :columns="columns" :page-size="searchResult?.limit || 10"
        :total="searchResult?.total || 0" :page="searchResult?.page || 1" :loading="isLoading"
        @filter-change="loadPosts" :show-filter="showFilter" :sticky="sticky" :load-data="loadPosts"
        :actions-u-r-l-base="URLBase" :delete-method="postStore.deletePost" entityName="Post"
        :create-query-params="createQueryParams" :show-header="showHeader" table-id="post"
        :return-url="computedReturnUrl" />
</template>

<script setup lang="ts">
import { type PostResponse, type QueryOptions } from '@pawspot/api-contracts'
import type { TypedTableColumn } from '~/types/table-types'
import {
    createIdColumn,
    createTextColumn,
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

const postStore = usePostStore()
const { searchResult, isLoading } = storeToRefs(postStore)

const tableKey = computed(() => generateTableKey(searchResult.value))
const URLBase = '/post'

async function loadPosts(query: QueryOptions<PostResponse>): Promise<void> {
    addParentFilter(query, parentConfig.value)
    await postStore.searchPosts(query)
}

const baseColumns: TypedTableColumn<PostResponse>[] = [
    createIdColumn<PostResponse>('15%'),
    createTextColumn<PostResponse>('title', 'Title', '25%'),
    createLinkColumn<PostResponse>('user', 'Author', '15%', {
        href: (row) => row.user ? `/user/${row.user.id}` : '',
        label: (row) => row.user?.name || row.user?.email || '-',
        sortKey: 'user.name',
        nestedFilterKey: 'user.name'
    }),
    createLinkColumn<PostResponse>('sanctuary', 'Sanctuary', '15%', {
        href: (row) => row.sanctuary ? `/sanctuary/${row.sanctuary.id}` : '',
        label: (row) => row.sanctuary?.name || '-',
        sortKey: 'sanctuary.name',
        nestedFilterKey: 'sanctuary.name'
    }),
    createCreatedAtColumn<PostResponse>('20%')
]

const columns = computed(() => {
    if (props.sanctuaryId) {
        return baseColumns.filter(col => col.accessorKey !== 'sanctuary')
    }
    return baseColumns
})
</script>

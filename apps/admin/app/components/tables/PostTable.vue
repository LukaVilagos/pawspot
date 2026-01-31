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

const postStore = usePostStore()
const { searchResult, isLoading } = storeToRefs(postStore)

const tableKey = computed(() => generateTableKey(searchResult.value))
const URLBase = '/post'

const createQueryParams = computed(() => {
    const params: Record<string, string> = {}
    if (props.sanctuaryId) {
        params.sanctuaryId = props.sanctuaryId
    }
    return params
})

async function loadPosts(query: QueryOptions<PostResponse>): Promise<void> {
    if (props.sanctuaryId) {
        query.filter = query.filter || []
        query.filter.push(['sanctuaryId', { op: 'eq', value: props.sanctuaryId }])
    }
    await postStore.searchPosts(query)
}

const baseColumns: TypedTableColumn<PostResponse>[] = [
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
        accessorKey: 'title',
        header: 'Title',
        sortable: true,
        filter: { type: 'text' },
        meta: {
            style: {
                th: 'width: 25%',
                td: 'width: 25%'
            }
        }
    },
    {
        accessorKey: 'user',
        header: 'Author',
        sortable: true,
        sortKey: 'user.name',
        filter: { type: 'text', nestedKey: 'user.name' },
        link: {
            href: (row) => row.user ? `/user/${row.user.id}` : '',
            label: (row) => row.user?.name || row.user?.email || '-'
        },
        meta: {
            style: {
                th: 'width: 15%',
                td: 'width: 15%'
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

const columns = computed(() => {
    if (props.sanctuaryId) {
        return baseColumns.filter(col => col.accessorKey !== 'sanctuary')
    }
    return baseColumns
})
</script>

<template>
    <Table :key="tableKey" :data="searchResult?.items || []" :columns="columns" :page-size="searchResult?.limit || 10"
        :total="searchResult?.total || 0" :page="searchResult?.page || 1" :loading="isLoading"
        @filter-change="loadUsers" :show-filter="showFilter" :sticky="sticky" :load-data="loadUsers"
        :actions-u-r-l-base="URLBase" :delete-method="userStore.deleteUser" entityName="User" :show-header="showHeader"
        table-id="user" />
</template>

<script setup lang="ts">
import { type UserResponse, type QueryOptions, UserTypeSchema } from '@pawspot/api-contracts'
import type { TypedTableColumn } from '~/types/table-types'
import { schemaToOptions } from '~/utils/options'
import {
    createIdColumn,
    createTextColumn,
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

const userStore = useUserStore()
const { searchResult, isLoading } = storeToRefs(userStore)

const tableKey = computed(() => generateTableKey(searchResult.value))
const URLBase = '/user'

async function loadUsers(query: QueryOptions<UserResponse>): Promise<void> {
    await userStore.searchUsers(query)
}

const columns: TypedTableColumn<UserResponse>[] = [
    createIdColumn<UserResponse>('15%'),
    createTextColumn<UserResponse>('email', 'Email', '35%'),
    createTextColumn<UserResponse>('name', 'Name', '10%'),
    {
        accessorKey: 'type',
        header: 'Type',
        sortable: true,
        filter: { type: 'select', options: schemaToOptions(UserTypeSchema) },
        meta: {
            style: {
                th: 'width: 10%',
                td: 'width: 10%'
            }
        }
    },
    createCreatedAtColumn<UserResponse>('20%')
]
</script>

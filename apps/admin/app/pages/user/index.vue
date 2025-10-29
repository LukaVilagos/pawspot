<template>
    <Table :key="tableKey" :data="searchResult?.items || []" :columns="columns" :page-size="searchResult?.limit || 10"
        :total="searchResult?.total || 0" :page="searchResult?.page || 1" :loading="isLoading"
        @filter-change="loadUsers" :show-filter="true" :sticky="true" :load-data="loadUsers"
        :actions-u-r-l-base="URLBase" :delete-method="userStore.deleteUser" entityName="User" />
</template>

<script setup lang="ts">
import { type UserResponse, type QueryOptions, UserType } from '@pawspot/api-contracts'
import type { TypedTableColumn } from '~/types/table-types'

const userStore = useUserStore()
const { searchResult, isLoading } = storeToRefs(userStore)

const tableKey = computed(() => generateTableKey(searchResult.value))
const URLBase = '/user'

async function loadUsers(query: QueryOptions<UserResponse>): Promise<void> {
    await userStore.searchUsers(query)
}

const columns: TypedTableColumn<UserResponse>[] = [
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
        accessorKey: 'email',
        header: 'Email',
        sortable: true,
        filter: { type: 'text' },
        meta: {
            style: {
                th: 'width: 35%',
                td: 'width: 35%'
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
                th: 'width: 10%',
                td: 'width: 10%'
            }
        }
    },
    {
        accessorKey: 'type',
        header: 'Type',
        sortable: true,
        filter: { type: 'select', options: Object.values(UserType).map((value) => ({ label: value, value })) },
        meta: {
            style: {
                th: 'width: 10%',
                td: 'width: 10%'
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

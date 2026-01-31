<template>
    <Table :key="tableKey" :data="searchResult?.items || []" :columns="columns" :page-size="searchResult?.limit || 10"
        :total="searchResult?.total || 0" :page="searchResult?.page || 1" :loading="isLoading"
        @filter-change="loadAuditLogs" :show-filter="showFilter" :sticky="sticky" :load-data="loadAuditLogs"
        :actions-u-r-l-base="URLBase" entityName="Audit Log" :show-header="showHeader" table-id="audit-log"
        :return-url="computedReturnUrl" :show-create-button="false" :show-edit-action="false" :show-actions="false" />
</template>

<script setup lang="ts">
import { type AuditLogResponse, type QueryOptions } from '@pawspot/api-contracts'
import type { TypedTableColumn } from '~/types/table-types'
import {
    createIdColumn,
    createTextColumn,
    createLinkColumn,
    createCreatedAtColumn,
    computeReturnUrl,
    addParentFilter,
    type ParentEntityConfig
} from '~/utils/tableUtils'

const props = withDefaults(defineProps<{
    showFilter?: boolean
    sticky?: boolean
    userId?: string
    showHeader?: boolean
    returnUrl?: string
}>(), {
    showFilter: true,
    sticky: true,
    showHeader: true,
    returnUrl: '',
})

const parentConfig = computed<ParentEntityConfig>(() => ({
    parentId: props.userId,
    parentPath: '/user',
    filterKey: 'userId'
}))

const computedReturnUrl = computed(() => computeReturnUrl(parentConfig.value, props.returnUrl))

const auditLogStore = useAuditLogStore()
const { searchResult, isLoading } = storeToRefs(auditLogStore)

const tableKey = computed(() => generateTableKey(searchResult.value))
const URLBase = '/audit-log'

async function loadAuditLogs(query: QueryOptions<AuditLogResponse>): Promise<void> {
    addParentFilter(query, parentConfig.value)
    await auditLogStore.searchAuditLogs(query)
}

const baseColumns: TypedTableColumn<AuditLogResponse>[] = [
    createIdColumn<AuditLogResponse>('20%'),
    createTextColumn<AuditLogResponse>('action', 'Action', '30%'),
    {
        accessorKey: 'user' as keyof AuditLogResponse & string,
        header: 'User',
        sortable: true,
        filter: { type: 'text', nestedKey: 'user.name' },
        sortKey: 'user.name',
        cell: (ctx) => {
            const user = ctx.cell.row.original.user
            if (!user) return '-'
            const label = user.name || user.email || '-'
            if (user.deletedAt) {
                return h('span', { class: 'text-muted' }, `${label} (deleted)`)
            }
            return h(resolveComponent('NuxtLink'), { to: `/user/${user.id}`, class: 'text-primary hover:underline' }, () => label)
        },
        meta: {
            style: {
                th: 'width: 25%',
                td: 'width: 25%'
            }
        }
    },
    createCreatedAtColumn<AuditLogResponse>('25%')
]

const columns = computed(() => {
    if (props.userId) {
        return baseColumns.filter(col => col.accessorKey !== 'user')
    }
    return baseColumns
})
</script>

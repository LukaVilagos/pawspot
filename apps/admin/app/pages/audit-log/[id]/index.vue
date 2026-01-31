<template>
    <View v-if="auditLog" :item="displayItem" :fields="fields" entity-name="Audit Log" :on-edit="() => { }"
        :on-delete="() => { }" />
    <LoadingSpinner v-else />
</template>

<script setup lang="ts">
import type { PageItem } from '~/types/PageItem'

const auditLogStore = useAuditLogStore()
const { auditLog } = storeToRefs(auditLogStore)

const { entityId } = useCrudPage({
    basePath: '/audit-log'
})

await auditLogStore.fetchAuditLogById(entityId.value)

const displayItem = computed(() => ({
    id: auditLog.value?.id,
    action: auditLog.value?.action,
    user: auditLog.value?.user?.name || auditLog.value?.user?.email || '-',
    createdAt: auditLog.value?.createdAt,
}))

const fields = computed<PageItem<typeof displayItem.value>[]>(() => [
    { accessorKey: 'id', header: 'ID', type: 'text' },
    { accessorKey: 'action', header: 'Action', type: 'text' },
    {
        accessorKey: 'user',
        header: 'User',
        type: 'text',
        href: auditLog.value?.user ? `/user/${auditLog.value.user.id}` : undefined
    },
    { accessorKey: 'createdAt', header: 'Created At', type: 'text' },
])
</script>

<template>
    <div v-if="user" class="p-6">
        <UPage>
            <UPageHeader headline="Details" title="User" description="Edit or delete this item" :links="headerLinks" />
            <UPageBody>
                <div class="space-y-4">
                    <FieldDisplay v-for="field in fields" :key="String(field.accessorKey)" :field="field"
                        :value="user[String(field.accessorKey)]" />
                </div>

                <div class="mt-8">
                    <h3 class="text-lg font-semibold mb-4">Audit Logs</h3>
                    <TablesAuditLogTable :user-id="user.id" :show-header="false" />
                </div>
            </UPageBody>
            <DeleteItemModal v-model="showDelete" item-name="User" @confirm="onDelete" />
        </UPage>
    </div>
    <LoadingSpinner v-else />
</template>

<script setup lang="ts">
import type { UserResponse } from '@pawspot/api-contracts'
import type { ButtonProps } from '@nuxt/ui'
import type { PageItem } from '~/types/PageItem'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const { entityId, navigateToEdit, navigateAfterDelete } = useCrudPage({
    basePath: '/user'
})

await userStore.fetchUserById(entityId.value)

const showDelete = ref(false)

const onEdit = () => navigateToEdit()
const onDelete = async () => {
    await userStore.deleteUser(entityId.value)
    navigateAfterDelete()
}

const headerLinks = ref<ButtonProps[]>([
    {
        label: 'Edit',
        icon: 'mdi-pencil',
        color: 'primary',
        onClick: onEdit,
    },
    {
        label: 'Delete',
        icon: 'mdi-delete',
        color: 'error',
        onClick: () => {
            showDelete.value = true;
        },
    },
])

const fields: PageItem<UserResponse>[] = [
    { accessorKey: 'email', header: 'Email', type: 'text' },
    { accessorKey: 'name', header: 'Name', type: 'text' },
    { accessorKey: 'createdAt', header: 'Created At', type: 'text' },
    { accessorKey: "type", header: "Type", type: "text" },
]
</script>

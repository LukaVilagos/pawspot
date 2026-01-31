<template>
    <View v-if="user" :item="user" :fields="fields" entity-name="User" :on-edit="onEdit" :on-delete="onDelete" />
    <LoadingSpinner v-else />
</template>

<script setup lang="ts">
import type { UserResponse } from '@pawspot/api-contracts'
import type { PageItem } from '~/types/PageItem'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const { entityId, navigateToEdit, navigateAfterDelete } = useCrudPage({
    basePath: '/user'
})

await userStore.fetchUserById(entityId.value)

const onEdit = () => navigateToEdit()
const onDelete = async () => {
    await userStore.deleteUser(entityId.value)
    navigateAfterDelete()
}

const fields: PageItem<UserResponse>[] = [
    { accessorKey: 'email', header: 'Email', type: 'text' },
    { accessorKey: 'name', header: 'Name', type: 'text' },
    { accessorKey: 'createdAt', header: 'Created At', type: 'text' },
    { accessorKey: "type", header: "Type", type: "text" },
]
</script>

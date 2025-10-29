<template>
    <View :item="user ?? {}" :fields="fields" entity-name="User" :on-edit="onEdit" :on-delete="onDelete" />
</template>

<script setup lang="ts">
import type { UserResponse } from '@pawspot/api-contracts'
import type { PageItem } from '~/types/PageItem'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

await userStore.fetchUserById(String(route.params.id))

const onEdit = () => router.push(`/user/edit/${route.params.id}`)
const onDelete = async () => {
    await userStore.deleteUser(String(route.params.id))
    router.push('/user')
}

const fields: PageItem<UserResponse>[] = [
    { accessorKey: 'email', header: 'Email', type: 'text' },
    { accessorKey: 'name', header: 'Name', type: 'text' },
    { accessorKey: 'createdAt', header: 'Created At', type: 'date' },
]
</script>

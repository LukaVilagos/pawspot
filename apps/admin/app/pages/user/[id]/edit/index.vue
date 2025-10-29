<template>
    <Edit :item="user ?? {}" :fields="items" :schema="EditUserSchema" :saveFn="saveUser" redirect-to="/user"
        entity-name="User" />
</template>

<script setup lang="ts">
import { UserTypeSchema, type UserResponse } from '@pawspot/api-contracts'
import type { PageItem } from '~/types/PageItem'
import { EditUserSchema } from '~/utils/validation/user'

const route = useRoute()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

await userStore.fetchUserById(String(route.params.id))

const saveUser = async (id: string | number | undefined, payload: Record<string, any>) => {
    if (!id) throw { message: 'Missing id' }
    await userStore.updateUser(String(id), payload)
}

const items: PageItem<UserResponse>[] = [
    { accessorKey: 'email', header: 'Email', type: 'text' },
    { accessorKey: 'name', header: 'Name', type: 'text' },
    { accessorKey: "type", header: "Type", type: "select", options: UserTypeSchema.options.map(o => { return { label: o, value: o } }) }
]
</script>

<template>
    <Create :fields="items" :schema="CreateUserSchema" redirect-to="/user" entity-name="User" @cancel="onCancel"
        @created="onCreated" />
</template>

<script setup lang="ts">
import { UserTypeSchema, type CreateUserRequest } from '@pawspot/api-contracts'
import type { PageItem } from '~/types/PageItem'
import { CreateUserSchema } from '~/utils/validation/userSchemas';

const userStore = useUserStore()
const router = useRouter()

const onCreated = async (values: CreateUserRequest) => {
    console.log('User created with values:', values)
    const createdItem = await userStore.createUser(values)
    router.push(`/user/${createdItem.id}`)
}

const onCancel = () => {
    router.push('/user')
}

const items: PageItem<CreateUserRequest>[] = [
    { accessorKey: 'email', header: 'Email', type: 'text' },
    { accessorKey: 'name', header: 'Name', type: 'text' },
    { accessorKey: "type", header: "Type", type: "select", options: schemaToOptions(UserTypeSchema), useDefaultOption: true },
    { accessorKey: 'password', header: 'Password', type: 'password' },
]

</script>
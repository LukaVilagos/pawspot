<template>
    <Create :fields="items" :schema="CreateSanctuarySchema" redirect-to="/sanctuary" entity-name="Sanctuary"
        @cancel="onCancel" @created="onCreated" />
</template>

<script setup lang="ts">
import type { CreateSanctuaryRequest } from '@pawspot/api-contracts'
import type { PageItem } from '~/types/PageItem'
import { CreateSanctuarySchema } from '~/utils/validation/sanctuarySchemas';
import { userToOptions } from '~/utils/options'

const sanctuaryStore = useSanctuaryStore()
const userStore = useUserStore()
const router = useRouter()

await userStore.fetchUsers()
const { users } = storeToRefs(userStore)

const userOptions = computed(() => userToOptions(users.value))

const onCreated = async (values: CreateSanctuaryRequest) => {
    const createdItem = await sanctuaryStore.createSanctuary(values)
    router.push(`/sanctuary/${createdItem.id}`)
}

const onCancel = () => {
    router.push('/sanctuary')
}

const items = computed<PageItem<CreateSanctuaryRequest>[]>(() => [
    { accessorKey: 'name', header: 'Name', type: 'text' },
    { accessorKey: 'location', header: 'Location', type: 'text' },
    { accessorKey: 'ownerId', header: 'Owner', type: 'select-search', options: userOptions.value },
])
</script>

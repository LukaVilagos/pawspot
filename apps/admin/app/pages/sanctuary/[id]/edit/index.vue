<template>
    <Edit v-if="sanctuary" :item="sanctuaryWithOwnerId" :fields="items" :schema="EditSanctuarySchema"
        :saveFn="saveSanctuary" redirect-to="/sanctuary" entity-name="Sanctuary" />
    <LoadingSpinner v-else />
</template>

<script setup lang="ts">
import type { SanctuaryResponse } from '@pawspot/api-contracts'
import type { PageItem } from '~/types/PageItem'
import { EditSanctuarySchema } from '~/utils/validation/sanctuarySchemas'
import { userToOptions } from '~/utils/options'

const sanctuaryStore = useSanctuaryStore()
const userStore = useUserStore()
const { sanctuary } = storeToRefs(sanctuaryStore)

const { entityId } = useCrudPage({
    basePath: '/sanctuary'
})

await Promise.all([
    sanctuaryStore.fetchSanctuaryById(entityId.value),
    userStore.fetchUsers()
])

const { users } = storeToRefs(userStore)

const userOptions = computed(() => userToOptions(users.value))

const sanctuaryWithOwnerId = computed(() => {
    if (!sanctuary.value) return null
    return {
        ...sanctuary.value,
        ownerId: sanctuary.value.owner?.id
    }
})

const saveSanctuary = async (id: string | number | undefined, payload: Record<string, any>) => {
    if (!id) throw { message: 'Missing id' }
    await sanctuaryStore.updateSanctuary(String(id), payload)
}

const items = computed<PageItem<SanctuaryResponse & { ownerId?: string }>[]>(() => [
    { accessorKey: 'name', header: 'Name', type: 'text' },
    { accessorKey: 'location', header: 'Location', type: 'text' },
    { accessorKey: 'ownerId', header: 'Owner', type: 'select-search', options: userOptions.value },
])
</script>

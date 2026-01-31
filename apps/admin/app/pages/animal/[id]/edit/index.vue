<template>
    <Edit v-if="animal" :item="animalWithSanctuaryId" :fields="items" :schema="EditAnimalSchema" :saveFn="saveAnimal"
        redirect-to="/animal" entity-name="Animal" />
    <LoadingSpinner v-else />
</template>

<script setup lang="ts">
import type { AnimalResponse } from '@pawspot/api-contracts'
import type { PageItem } from '~/types/PageItem'
import { EditAnimalSchema } from '~/utils/validation/animalSchemas'
import { sanctuaryToOptions } from '~/utils/options'

const animalStore = useAnimalStore()
const sanctuaryStore = useSanctuaryStore()
const { animal } = storeToRefs(animalStore)

const { entityId } = useCrudPage({
    basePath: '/animal'
})

await Promise.all([
    animalStore.fetchAnimalById(entityId.value),
    sanctuaryStore.fetchSanctuaries()
])

const { sanctuaries } = storeToRefs(sanctuaryStore)

const sanctuaryOptions = computed(() => sanctuaryToOptions(sanctuaries.value))

const animalWithSanctuaryId = computed(() => {
    if (!animal.value) return null
    return {
        ...animal.value,
        sanctuaryId: animal.value.sanctuary?.id
    }
})

const saveAnimal = async (id: string | number | undefined, payload: Record<string, any>) => {
    if (!id) throw { message: 'Missing id' }
    await animalStore.updateAnimal(String(id), payload)
}

const items = computed<PageItem<AnimalResponse & { sanctuaryId?: string }>[]>(() => [
    { accessorKey: 'name', header: 'Name', type: 'text' },
    { accessorKey: 'species', header: 'Species', type: 'text' },
    { accessorKey: 'age', header: 'Age', type: 'number' },
    { accessorKey: 'sanctuaryId', header: 'Sanctuary', type: 'select-search', options: sanctuaryOptions.value },
])
</script>

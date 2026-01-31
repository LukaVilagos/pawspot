<template>
    <View v-if="animal" :item="displayItem" :fields="fields" entity-name="Animal" :on-edit="onEdit"
        :on-delete="onDelete" />
    <LoadingSpinner v-else />
</template>

<script setup lang="ts">
import type { PageItem } from '~/types/PageItem'

const animalStore = useAnimalStore()
const { animal } = storeToRefs(animalStore)

const { entityId, navigateToEdit, navigateAfterDelete } = useCrudPage({
    basePath: '/animal'
})

await animalStore.fetchAnimalById(entityId.value)

const onEdit = () => navigateToEdit()
const onDelete = async () => {
    await animalStore.deleteAnimal(entityId.value)
    navigateAfterDelete()
}

const displayItem = computed(() => ({
    name: animal.value?.name,
    species: animal.value?.species,
    age: animal.value?.age,
    sanctuary: animal.value?.sanctuary?.name || '-',
    createdAt: animal.value?.createdAt,
}))

const fields = computed<PageItem<typeof displayItem.value>[]>(() => [
    { accessorKey: 'name', header: 'Name', type: 'text' },
    { accessorKey: 'species', header: 'Species', type: 'text' },
    { accessorKey: 'age', header: 'Age', type: 'number' },
    {
        accessorKey: 'sanctuary',
        header: 'Sanctuary',
        type: 'text',
        href: animal.value?.sanctuary ? `/sanctuary/${animal.value.sanctuary.id}` : undefined
    },
    { accessorKey: 'createdAt', header: 'Created At', type: 'text' },
])
</script>

<template>
    <View v-if="animal" :item="displayItem" :fields="fields" entity-name="Animal" :on-edit="onEdit"
        :on-delete="onDelete" />
    <div v-else class="flex items-center justify-center h-screen">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
    </div>
</template>

<script setup lang="ts">
import type { PageItem } from '~/types/PageItem'

const route = useRoute()
const router = useRouter()
const animalStore = useAnimalStore()
const { animal } = storeToRefs(animalStore)

await animalStore.fetchAnimalById(String(route.params.id))

const returnUrl = computed(() => {
    const url = route.query.returnUrl
    return typeof url === 'string' ? url : undefined
})

const onEdit = () => {
    const editPath = `/animal/${route.params.id}/edit/`
    if (returnUrl.value) {
        router.push(`${editPath}?returnUrl=${encodeURIComponent(returnUrl.value)}`)
    } else {
        router.push(editPath)
    }
}
const onDelete = async () => {
    await animalStore.deleteAnimal(String(route.params.id))
    if (returnUrl.value) {
        router.push(returnUrl.value)
    } else {
        router.push('/animal')
    }
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

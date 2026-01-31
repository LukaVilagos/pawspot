<template>
    <Create :fields="items" :schema="CreateAnimalSchema" redirect-to="/animal" entity-name="Animal"
        :initial-values="initialValues" @cancel="onCancel" @created="onCreated" />
</template>

<script setup lang="ts">
import type { CreateAnimalRequest } from '@pawspot/api-contracts'
import type { PageItem } from '~/types/PageItem'
import { CreateAnimalSchema } from '~/utils/validation/animalSchemas';

const animalStore = useAnimalStore()
const sanctuaryStore = useSanctuaryStore()
const router = useRouter()
const route = useRoute()

await sanctuaryStore.fetchSanctuaries()
const { sanctuaries } = storeToRefs(sanctuaryStore)

const prefilledSanctuaryId = computed(() => {
    const sanctuaryId = route.query.sanctuaryId
    return typeof sanctuaryId === 'string' ? sanctuaryId : undefined
})

const initialValues = computed(() => {
    const values: Partial<CreateAnimalRequest> = {}
    if (prefilledSanctuaryId.value) {
        values.sanctuaryId = prefilledSanctuaryId.value
    }
    return values
})

const returnUrl = computed(() => {
    const url = route.query.returnUrl
    return typeof url === 'string' ? url : undefined
})

const sanctuaryOptions = computed(() =>
    sanctuaries.value.map(s => ({ label: s.name, value: s.id }))
)

const onCreated = async (values: CreateAnimalRequest, passedReturnUrl?: string) => {
    const createdItem = await animalStore.createAnimal(values)
    const redirectTarget = passedReturnUrl || returnUrl.value
    if (redirectTarget) {
        router.push(redirectTarget)
    } else {
        router.push(`/animal/${createdItem.id}`)
    }
}

const onCancel = (passedReturnUrl?: string) => {
    const redirectTarget = passedReturnUrl || returnUrl.value
    if (redirectTarget) {
        router.push(redirectTarget)
    } else if (prefilledSanctuaryId.value) {
        router.push(`/sanctuary/${prefilledSanctuaryId.value}`)
    } else {
        router.push('/animal')
    }
}

const items = computed<PageItem<CreateAnimalRequest>[]>(() => [
    { accessorKey: 'name', header: 'Name', type: 'text' },
    { accessorKey: 'species', header: 'Species', type: 'text' },
    { accessorKey: 'age', header: 'Age', type: 'number' },
    { accessorKey: 'sanctuaryId', header: 'Sanctuary', type: 'select-search', options: sanctuaryOptions.value },
])
</script>

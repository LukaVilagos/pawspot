<template>
    <Create :fields="items" :schema="CreateAnimalSchema" redirect-to="/animal" entity-name="Animal"
        :initial-values="initialValues" @cancel="onCancel" @created="onCreated" />
</template>

<script setup lang="ts">
import type { CreateAnimalRequest } from '@pawspot/api-contracts'
import type { PageItem } from '~/types/PageItem'
import { CreateAnimalSchema } from '~/utils/validation/animalSchemas';
import { sanctuaryToOptions } from '~/utils/options'

const animalStore = useAnimalStore()
const sanctuaryStore = useSanctuaryStore()

await sanctuaryStore.fetchSanctuaries()
const { sanctuaries } = storeToRefs(sanctuaryStore)

const { prefilledId: prefilledSanctuaryId, navigateAfterCreate, navigateOnCancel } = useCrudPage({
    basePath: '/animal',
    prefilledIdKey: 'sanctuaryId',
    prefilledParentPath: '/sanctuary'
})

const initialValues = computed(() => {
    const values: Partial<CreateAnimalRequest> = {}
    if (prefilledSanctuaryId.value) {
        values.sanctuaryId = prefilledSanctuaryId.value
    }
    return values
})

const sanctuaryOptions = computed(() => sanctuaryToOptions(sanctuaries.value))

const onCreated = async (values: CreateAnimalRequest, passedReturnUrl?: string) => {
    const createdItem = await animalStore.createAnimal(values)
    navigateAfterCreate(createdItem.id, passedReturnUrl)
}

const onCancel = (passedReturnUrl?: string) => {
    navigateOnCancel(passedReturnUrl)
}

const items = computed<PageItem<CreateAnimalRequest>[]>(() => [
    { accessorKey: 'name', header: 'Name', type: 'text' },
    { accessorKey: 'species', header: 'Species', type: 'text' },
    { accessorKey: 'age', header: 'Age', type: 'number' },
    { accessorKey: 'sanctuaryId', header: 'Sanctuary', type: 'select-search', options: sanctuaryOptions.value },
])
</script>

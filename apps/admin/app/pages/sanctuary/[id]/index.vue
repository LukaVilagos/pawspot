<template>
    <div v-if="sanctuary" class="p-6">
        <UPage>
            <UPageHeader headline="Details" title="Sanctuary" description="Edit or delete this item"
                :links="headerLinks" />
            <UPageBody>
                <div class="space-y-4">
                    <FieldDisplay v-for="field in fields" :key="String(field.accessorKey)" :field="field"
                        :value="displayItem[String(field.accessorKey)]" />
                </div>

                <div class="mt-8">
                    <h3 class="text-lg font-semibold mb-4">Animals</h3>
                    <TablesAnimalTable :sanctuary-id="sanctuary.id" :show-header="false" />
                </div>

                <div class="mt-8">
                    <h3 class="text-lg font-semibold mb-4">Posts</h3>
                    <TablesPostTable :sanctuary-id="sanctuary.id" :show-header="false" />
                </div>

                <div class="mt-8">
                    <h3 class="text-lg font-semibold mb-4">Contributors ({{ sanctuary.contributors?.length || 0 }})</h3>
                    <UTable v-if="sanctuary.contributors?.length" :data="sanctuary.contributors"
                        :columns="contributorColumns" />
                    <p v-else class="text-gray-500">No contributors for this sanctuary.</p>
                </div>
            </UPageBody>
            <DeleteItemModal v-model="showDelete" item-name="Sanctuary" @confirm="onDelete" />
        </UPage>
    </div>
    <div v-else class="flex items-center justify-center h-screen">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
    </div>
</template>

<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'
import type { PageItem } from '~/types/PageItem'

const route = useRoute()
const router = useRouter()
const sanctuaryStore = useSanctuaryStore()
const { sanctuary } = storeToRefs(sanctuaryStore)

await sanctuaryStore.fetchSanctuaryById(String(route.params.id))

const showDelete = ref(false)

const onEdit = () => router.push(`/sanctuary/${route.params.id}/edit/`)
const onDelete = async () => {
    await sanctuaryStore.deleteSanctuary(String(route.params.id))
    router.push('/sanctuary')
}

const headerLinks = ref<ButtonProps[]>([
    {
        label: 'Edit',
        icon: 'mdi-pencil',
        color: 'primary',
        onClick: onEdit,
    },
    {
        label: 'Delete',
        icon: 'mdi-delete',
        color: 'error',
        onClick: () => {
            showDelete.value = true;
        },
    },
])

const displayItem = computed(() => ({
    name: sanctuary.value?.name,
    location: sanctuary.value?.location,
    owner: sanctuary.value?.owner?.name || sanctuary.value?.owner?.email || '-',
    createdAt: sanctuary.value?.createdAt,
}))

const fields = computed<PageItem<typeof displayItem.value>[]>(() => [
    { accessorKey: 'name', header: 'Name', type: 'text' },
    { accessorKey: 'location', header: 'Location', type: 'text' },
    {
        accessorKey: 'owner',
        header: 'Owner',
        type: 'text',
        href: sanctuary.value?.owner ? `/user/${sanctuary.value.owner.id}` : undefined
    },
    { accessorKey: 'createdAt', header: 'Created At', type: 'text' },
])

const contributorColumns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'name', header: 'Name' },
]
</script>

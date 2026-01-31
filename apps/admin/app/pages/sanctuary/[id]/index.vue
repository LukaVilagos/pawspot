<template>
    <div v-if="sanctuary" class="p-6">
        <UPage>
            <UPageHeader headline="Details" title="Sanctuary" description="Edit or delete this item"
                :links="headerLinks" />
            <UPageBody>
                <div class="space-y-4">
                    <FieldDisplay v-for="field in fields" :key="field.accessorKey" :field="field"
                        :value="displayItem[field.accessorKey]" />
                </div>

                <div class="mt-8">
                    <h3 class="text-lg font-semibold mb-4">QR Code</h3>
                    <div v-if="sanctuary.qrCode" class="flex flex-col items-start gap-4">
                        <img :src="sanctuary.qrCode.imageUrl" alt="Sanctuary QR Code"
                            class="w-48 h-48 border rounded" />
                        <p class="text-sm text-muted">
                            Scan to visit: <a :href="sanctuary.qrCode.targetUrl" target="_blank"
                                class="text-primary hover:underline">{{ sanctuary.qrCode.targetUrl }}</a>
                        </p>
                    </div>
                    <div v-else class="flex flex-col items-start gap-4">
                        <p class="text-sm text-muted">No QR code generated yet.</p>
                        <UButton label="Generate QR Code" icon="i-lucide-qr-code" color="primary"
                            :loading="isGeneratingQr" @click="handleGenerateQrCode" />
                    </div>
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
                    <TablesContributorTable :sanctuary-id="sanctuary.id" />
                </div>
            </UPageBody>
            <DeleteItemModal v-model="showDelete" item-name="Sanctuary" @confirm="onDelete" />
        </UPage>
    </div>
    <LoadingSpinner v-else />
</template>

<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'
import type { PageItem } from '~/types/PageItem'

const sanctuaryStore = useSanctuaryStore()
const { sanctuary } = storeToRefs(sanctuaryStore)

const { entityId, navigateToEdit, navigateAfterDelete } = useCrudPage({
    basePath: '/sanctuary'
})

await sanctuaryStore.fetchSanctuaryById(entityId.value)

const showDelete = ref(false)
const isGeneratingQr = ref(false)

const onEdit = () => navigateToEdit()
const onDelete = async () => {
    await sanctuaryStore.deleteSanctuary(entityId.value)
    navigateAfterDelete()
}

const handleGenerateQrCode = async () => {
    isGeneratingQr.value = true
    try {
        await sanctuaryStore.generateQrCode(entityId.value)
    } finally {
        isGeneratingQr.value = false
    }
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
</script>

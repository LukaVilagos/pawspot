<template>
    <UDropdownMenu :items="items">
        <UButton icon="mdi-dots-vertical" color="neutral" variant="outline" />
    </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { basePath, deleteMethod, id, additionalItems } = defineProps<{
    basePath: string,
    deleteMethod: () => Promise<void>,
    id: string,
    additionalItems?: DropdownMenuItem[][]
}>();

const items = ref<DropdownMenuItem[][]>([
    [
        {
            label: 'View',
            to: `${basePath}/${id}`,
            icon: 'mdi-eye',
        },
        {
            label: 'Edit',
            to: `${basePath}/${id}/edit`,
            icon: 'mdi-pencil',
        },
        {
            label: 'Delete',
            icon: 'mdi-delete',
            variant: 'danger',
            onClick: deleteMethod,
        },
    ],
    ...(additionalItems ?? []),
]);
</script>

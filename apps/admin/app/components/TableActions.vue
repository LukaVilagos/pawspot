<template>
    <UDropdownMenu :items="items">
        <UButton icon="mdi-dots-vertical" color="neutral" variant="outline" />
    </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const props = defineProps<{
    basePath: string,
    deleteMethod: () => Promise<void>,
    id: string,
    additionalItems?: DropdownMenuItem[][],
    returnUrl?: string
}>();

const buildUrl = (path: string) => {
    if (props.returnUrl) {
        const separator = path.includes('?') ? '&' : '?'
        return `${path}${separator}returnUrl=${encodeURIComponent(props.returnUrl)}`
    }
    return path
}

const items = ref<DropdownMenuItem[][]>([
    [
        {
            label: 'View',
            to: buildUrl(`${props.basePath}/${props.id}`),
            icon: 'mdi-eye',
        },
        {
            label: 'Edit',
            to: buildUrl(`${props.basePath}/${props.id}/edit`),
            icon: 'mdi-pencil',
        },
        {
            label: 'Delete',
            icon: 'mdi-delete',
            variant: 'danger',
            onClick: props.deleteMethod,
        },
    ],
    ...(props.additionalItems ?? []),
]);
</script>

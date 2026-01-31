<template>
    <UDropdownMenu :items="items">
        <UButton icon="mdi-dots-vertical" color="neutral" variant="outline" />
    </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { appendReturnUrl } from '~/utils/urlParams'

const props = defineProps<{
    basePath: string,
    deleteMethod: () => Promise<void>,
    id: string,
    additionalItems?: DropdownMenuItem[][],
    returnUrl?: string
}>();

const items = ref<DropdownMenuItem[][]>([
    [
        {
            label: 'View',
            to: appendReturnUrl(`${props.basePath}/${props.id}`, props.returnUrl),
            icon: 'mdi-eye',
        },
        {
            label: 'Edit',
            to: appendReturnUrl(`${props.basePath}/${props.id}/edit`, props.returnUrl),
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

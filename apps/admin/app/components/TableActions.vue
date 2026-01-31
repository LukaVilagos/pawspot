<template>
    <UDropdownMenu :items="items">
        <UButton icon="mdi-dots-vertical" color="neutral" variant="outline" />
    </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { appendReturnUrl } from '~/utils/urlParams'

const props = withDefaults(defineProps<{
    basePath: string,
    deleteMethod: () => Promise<void>,
    id: string,
    additionalItems?: DropdownMenuItem[][],
    returnUrl?: string,
    showEdit?: boolean
}>(), {
    showEdit: true
});

const items = computed<DropdownMenuItem[][]>(() => {
    const baseItems: DropdownMenuItem[] = [
        {
            label: 'View',
            to: appendReturnUrl(`${props.basePath}/${props.id}`, props.returnUrl),
            icon: 'mdi-eye',
        },
    ];

    if (props.showEdit) {
        baseItems.push({
            label: 'Edit',
            to: appendReturnUrl(`${props.basePath}/${props.id}/edit`, props.returnUrl),
            icon: 'mdi-pencil',
        });
    }

    baseItems.push({
        label: 'Delete',
        icon: 'mdi-delete',
        variant: 'danger',
        onClick: props.deleteMethod,
    });

    return [
        baseItems,
        ...(props.additionalItems ?? []),
    ];
});
</script>

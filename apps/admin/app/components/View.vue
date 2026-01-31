<template>
    <UPage>
        <UPageHeader headline="Details" :title="props.entityName" description="Edit or delete this item"
            :links="headerLinks" />

        <UPageBody>
            <div class="space-y-4">
                <FieldDisplay v-for="field in props.fields" :key="String(field.accessorKey)" :field="field"
                    :value="props.item[String(field.accessorKey)]" />
            </div>
        </UPageBody>

        <DeleteItemModal v-model="showDelete" :item-name="props.entityName" @confirm="props.onDelete" />
    </UPage>
</template>

<script setup lang="ts">
import type { PageItem } from '~/types/PageItem'
import type { ButtonProps } from '@nuxt/ui'

const props = withDefaults(defineProps<{
    item: Record<string, any>
    fields: PageItem<any>[]
    entityName: string
    onEdit: () => void
    onDelete: () => Promise<void> | void
}>(), {
    item: () => ({}),
    fields: () => [],
    entityName: 'Item',
    onEdit: () => { },
    onDelete: async () => { }
})

const showDelete = ref(false)
const headerLinks = ref<ButtonProps[]>([
    {
        label: 'Edit',
        icon: 'mdi-pencil',
        color: 'primary',
        onClick: props.onEdit,
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
</script>

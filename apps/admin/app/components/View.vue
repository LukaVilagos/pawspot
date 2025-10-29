<template>
    <UPage>
        <UPageHeader headline="Details" :title="entityName" description="Edit or delete this item"
            :links="headerLinks" />

        <UPageBody>
            <div>
                <FieldDisplay v-for="field in fields" :key="String(field.accessorKey)" :field="field"
                    :value="item[String(field.accessorKey)]" />
            </div>
        </UPageBody>

        <DeleteItemModal v-model="showDelete" :item-name="entityName" @confirm="onDelete" />
    </UPage>
</template>

<script setup lang="ts">
import type { PageItem } from '~/types/PageItem'
import type { ButtonProps } from '@nuxt/ui'

const { item, fields, entityName, onEdit, onDelete } = defineProps<{
    item: Record<string, any>
    fields: PageItem<any>[]
    entityName: string
    onEdit: () => void
    onDelete: () => Promise<void> | void
}>()

const showDelete = ref(false)

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
</script>

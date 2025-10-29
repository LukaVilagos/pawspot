<template>
    <UPage>
        <UPageHeader headline="Details" :title="entityName" description="Edit or delete this item"
            :links="headerLinks" />

        <UPageBody>
            <div v-for="field in fields" :key="String(field.accessorKey)">
                <div class="text-sm text-gray-500">{{ field.header }}</div>
                <div class="font-medium">
                    <template v-if="field.type === 'boolean'">
                        <UBadge :color="item[String(field.accessorKey)] ? 'info' : 'error'">
                            {{ item[String(field.accessorKey)] ? 'Yes' : 'No' }}
                        </UBadge>
                    </template>
                    <template v-else-if="field.type === 'date'">
                        {{ new Date(item[String(field.accessorKey)]).toLocaleString() }}
                    </template>
                    <template v-else-if="field.type === 'custom' && field.component">
                        <component :is="field.component" v-bind="item[String(field.accessorKey)]" />
                    </template>
                    <template v-else>
                        {{ item[String(field.accessorKey)] }}
                    </template>
                </div>
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

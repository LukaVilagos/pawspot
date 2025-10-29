<template>
    <div>
        <div class="text-sm text-gray-500">{{ field.header }}</div>
        <div class="font-medium">
            <template v-if="field.component">
                <component :is="field.component" v-bind="value" />
            </template>
            <template v-else-if="field.type === 'boolean'">
                <UBadge :color="value ? 'info' : 'error'">{{ value ? 'Yes' : 'No' }}</UBadge>
            </template>
            <template v-else-if="field.type === 'date'">
                {{ formattedDate }}
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PageItem } from '~/types/PageItem'

const props = defineProps<{
    field: PageItem<any>
    value: any
}>()

const formattedDate = computed(() => {
    if (props.field.type !== 'date') return ''
    const date = props.value == null ? null : new Date(props.value)
    return date ? date.toLocaleString() : ''
})
</script>
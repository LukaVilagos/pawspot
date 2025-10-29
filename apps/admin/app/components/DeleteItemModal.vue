<template>
    <Modal v-model="open" :title="`Delete ${itemName}`"
        :message="`Are you sure you want to delete this ${itemName}? This action cannot be undone.`"
        @confirm="confirmDelete" />
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean
    itemName: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'confirm'): void
}>()

const open = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v),
})

const confirmDelete = () => emit('confirm')
</script>

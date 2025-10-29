<template>
    <Modal :model-value="modelValue" :title="`Delete ${itemName}`"
        :message="`Are you sure you want to delete this ${itemName}? This action cannot be undone.`"
        @update:model-value="val => emit('update:modelValue', val)" @confirm="confirmDelete" />
</template>

<script setup lang="ts">
defineProps<{
    modelValue: boolean
    itemName: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'confirm'): void
}>()

const confirmDelete = () => {
    emit('update:modelValue', false)
    emit('confirm')
}
</script>

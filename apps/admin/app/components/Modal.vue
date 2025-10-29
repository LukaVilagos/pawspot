<template>
    <UModal v-model="open" :title="title">
        <template #body>
            {{ message }}
        </template>
        <template #footer>
            <UButton variant="outline" size="sm" @click="onCancel">Cancel</UButton>
            <UButton variant="solid" color="error" size="sm" @click="onConfirm">Delete</UButton>
        </template>
    </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean
    title: string
    message: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'confirm'): void
}>()

const open = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v),
})

const onCancel = () => emit('update:modelValue', false)
const onConfirm = () => emit('confirm')
</script>

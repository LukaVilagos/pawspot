<template>
    <UModal v-model:open="open" :title="title">
        <template #body>
            {{ message }}
        </template>
        <template #footer>
            <div class="flex justify-end w-full gap-2">
                <UButton variant="outline" @click="onCancel">Cancel</UButton>
                <UButton variant="solid" color="error" @click="onConfirm">Delete</UButton>
            </div>
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

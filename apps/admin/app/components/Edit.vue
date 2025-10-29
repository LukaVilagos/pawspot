<template>
	<UForm @submit.prevent="onSubmit" class="flex flex-col gap-4">
		<div v-for="field in fields" :key="field.accessorKey" class="flex flex-col">
			<CustomizableInput v-model="form[String(field.accessorKey)]" :type="field.type || 'text'"
				:options="field.options" :custom-component="field.component"
				:component-props="field.componentProps || {}" :label="field.header" />
		</div>

		<div class="flex gap-2 mt-2">
			<UButton type="submit" variant="solid" size="sm">Save</UButton>
			<UButton type="button" variant="ghost" size="sm" @click="onCancel">Cancel</UButton>
		</div>
	</UForm>
</template>

<script setup lang="ts">
export type EditPageItem<T> = {
	accessorKey: keyof T
	header: string
	type?: string
	options?: { label: string; value: any }[]
	component?: any
	componentProps?: Record<string, any>
}

const props = defineProps<{
	fields: EditPageItem<any>[]
	item: Record<string, any>
	idAccessor?: string
}>()

const emit = defineEmits<{
	(e: 'saved', payload: any): void
	(e: 'cancel'): void
}>()

const form = reactive({} as Record<string, any>)

const initialize = () => {
	props.fields.forEach(f => {
		const key = String(f.accessorKey)
		form[key] = props.item?.[key] ?? null
	})
}

initialize()

const onSubmit = async () => {
	const id = props.item?.[props.idAccessor ?? 'id']
	emit('saved', { id, ...form })
}

const onCancel = () => emit('cancel')
</script>

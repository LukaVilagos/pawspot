<template>
	<UPage>
		<UForm @submit.prevent="submitHandler">
			<UPageHeader headline="Edit Item" :title="entityName" description="Modify the fields below"
				:links="headerLinks" />
			<UPageBody>
				<div v-if="errors._global" class="text-red-500 text-sm">
					{{ errors._global }}
				</div>
				<div>
					<UFormField v-for="field in fields" :key="String(field.accessorKey)" :label="field.header"
						:error="errors[String(field.accessorKey)]">
						<CustomizableInput v-model="formValues[String(field.accessorKey)]" :type="field.type || 'text'"
							:options="field.options" :custom-component="field.component"
							:component-props="field.componentProps || {}" />
					</UFormField>
				</div>
			</UPageBody>
		</UForm>
	</UPage>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import type z from 'zod';
import type { PageItem } from '~/types/PageItem'
import type { ButtonProps } from '@nuxt/ui'

const props = defineProps<{
	fields: PageItem<any>[]
	item: Record<string, any>
	schema: z.ZodTypeAny
	entityName: string
	saveFn: (id: string | number | undefined, payload: Record<string, any>) => Promise<any>
	redirectTo?: string
	idAccessor?: string
}>()

const emit = defineEmits<{
	(e: 'cancel'): void
	(e: 'saved', payload: any): void
}>()

const router = useRouter()

const validationSchema = toTypedSchema(props.schema)
const { handleSubmit, errors, isSubmitting, defineField, setFieldError, setErrors } = useForm({
	validationSchema,
	initialValues: props.item,
})

const formValues = reactive<Record<string, any>>({})
for (const key of Object.keys(props.item ?? {})) {
	const [value] = defineField(key as any)
	formValues[key] = value
}

const onSubmit = handleSubmit(async (values) => {
	const id = props.item?.[props.idAccessor ?? 'id']
	try {
		await props.saveFn(id, values)
		emit('saved', { id, ...values })
		if (props.redirectTo) await router.push(props.redirectTo)
	} catch (err: any) {
		if (err?.field && err?.message) {
			setFieldError(String(err.field), String(err.message))
			return
		}
		if (err?.errors && typeof err.errors === 'object') {
			setErrors(err.errors)
			return
		}
		if (err?.message) {
			setFieldError('_global', String(err.message))
			return
		}
		setFieldError('_global', 'An unexpected error occurred')
	}
})

const submitHandler = (e?: Event) => {
	void onSubmit(e as any)
}

const onCancel = () => {
	emit('cancel')
	if (props.redirectTo) router.push(props.redirectTo)
}

const headerLinks = ref<ButtonProps[]>([
	{
		label: 'Save',
		icon: 'mdi-pencil',
		color: 'primary',
		type: 'submit',
	},
	{
		label: 'Cancel',
		icon: 'mdi-cancel',
		color: 'error',
		onClick: onCancel,
	},
])
</script>

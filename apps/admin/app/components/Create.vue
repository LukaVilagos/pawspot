<template>
    <UForm @submit="submitHandler">
        <UPage>
            <UPageHeader v-if="showHeader" :headline="headline" :title="title" :description="description"
                :links="headerLinks" />
            <UPageBody>
                <div v-if="errors._global" class="text-red-500 text-sm mb-4">
                    {{ errors._global }}
                </div>
                <div>
                    <UFormField v-for="field in fields" :key="String(field.accessorKey)" :label="field.header"
                        :error="errors[String(field.accessorKey)]">
                        <CustomizableInput v-model="formValues[String(field.accessorKey)]" :type="field.type || 'text'"
                            :options="field.options" :custom-component="field.component"
                            :component-props="field.componentProps || {}" :use-default-option="field.useDefaultOption"
                            :placeholder="`Enter ${field.header}`" />
                    </UFormField>
                </div>
            </UPageBody>
        </UPage>
    </UForm>
</template>

<script setup lang="ts">
import type z from 'zod';
import type { PageItem } from '~/types/PageItem';
import type { ButtonProps } from '@nuxt/ui'
import { getReturnUrl } from '~/utils/urlParams'

const route = useRoute()

const props = withDefaults(defineProps<{
    fields: PageItem<any>[]
    schema: z.ZodTypeAny
    entityName: string
    initialValues?: Record<string, any>
    showHeader?: boolean
    headline?: string
    title?: string
    description?: string
}>(), {
    initialValues: () => ({}),
    showHeader: true,
    headline: 'Create Item',
    title: undefined,
    description: 'Create a new item'
})

const returnUrl = computed(() => getReturnUrl(route))

const headline = computed(() => props.headline)
const title = computed(() => props.title ?? props.entityName)
const description = computed(() => props.description)

const emit = defineEmits<{
    (e: 'cancel', returnUrl?: string): void
    (e: 'created', payload: any, returnUrl?: string): void
}>()

const { handleSubmit, errors, defineField, setFieldError, setErrors } = useForm({
    validationSchema: toTypedSchema(props.schema),
    initialValues: props.initialValues,
})

const formValues = reactive<Record<string, any>>({})
for (const field of props.fields) {
    const [value] = defineField(field.accessorKey)
    formValues[field.accessorKey as string] = value
}

const onSubmit = handleSubmit(async (values) => {
    try {
        emit('created', values, returnUrl.value)
    } catch (error: any) {
        if (error?.validationErrors) {
            setErrors(error.validationErrors)
        } else if (error?.message) {
            setFieldError('_global', error.message)
        } else {
            setFieldError('_global', 'An unexpected error occurred.')
        }
    }
})


const submitHandler = (e?: Event) => {
    void onSubmit(e)
}

const onCancel = () => {
    emit('cancel', returnUrl.value)
}


const headerLinks = ref<ButtonProps[]>([
    {
        label: `Create ${props.entityName}`,
        icon: 'mdi-plus',
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
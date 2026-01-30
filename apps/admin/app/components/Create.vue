<template>
    <UForm @submit="submitHandler">
        <UPage>
            <UPageHeader headline="Create Item" :title="entityName" description="Create a new user"
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


const props = defineProps<{
    fields: PageItem<any>[]
    schema: z.ZodTypeAny
    entityName: string
}>()

const emit = defineEmits<{
    (e: 'cancel'): void
    (e: 'created', payload: any): void
}>()

const { handleSubmit, errors, defineField, setFieldError, setErrors } = useForm({
    validationSchema: toTypedSchema(props.schema),
    initialValues: {},
})

const formValues = reactive<Record<string, any>>({})
for (const field of props.fields) {
    const [value] = defineField(field.accessorKey)
    formValues[field.accessorKey as string] = value
}

const onSubmit = handleSubmit(async (values) => {
    try {
        emit('created', values)
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
    emit('cancel')
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
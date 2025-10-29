import { reactive } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { z } from 'zod'

export function useEditForm<T extends Record<string, any>>(
    schema: z.ZodTypeAny,
    initialValues: Partial<T>,
    onSubmitCallback: (values: T) => Promise<void> | void
) {
    const validationSchema = toTypedSchema(schema)

    const { handleSubmit, errors, isSubmitting, defineField, setValues, setFieldError, setErrors } =
        useForm<T>({
            validationSchema,
            initialValues: initialValues as any,
        })

    const formValues = reactive<Record<string, any>>({})
    for (const key of Object.keys(initialValues ?? {})) {
        const [value] = defineField(key as any)
        formValues[key] = value
    }

    const onSubmit = handleSubmit(async (values) => {
        await onSubmitCallback(values as T)
    })

    const handleSubmitForm = async () => {
        await onSubmit()
    }

    return {
        formValues,
        errors,
        isSubmitting,
        handleSubmitForm,
        setValues,
        setFieldError,
        setErrors,
    }
}

import type { RegisterUserRequest } from "@pawspot/api-contracts";
import { toTypedSchema } from "@vee-validate/zod";
import { RegisterFormSchema } from "~/utils/validation/registerSchema";

export const useRegisterForm = () => {
    const authStore = useAuthStore();
    const validationSchema = toTypedSchema(RegisterFormSchema);

    const { handleSubmit, errors, defineField, isSubmitting } = useForm({
        validationSchema,
    });

    const [name, nameAttrs] = defineField('name');
    const [email, emailAttrs] = defineField('email');
    const [password, passwordAttrs] = defineField('password');
    const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword');

    const onSubmit = handleSubmit(async (values) => {
        const body: RegisterUserRequest = {
            name: values.name,
            email: values.email,
            password: values.password,
        };

        await authStore.handleRegister(body);
    });

    const handleSubmitForm = async () => {
        await onSubmit();
    }

    return {
        name,
        nameAttrs,
        email,
        emailAttrs,
        password,
        passwordAttrs,
        confirmPassword,
        confirmPasswordAttrs,
        errors,
        isSubmitting,
        handleSubmitForm,
    };

}

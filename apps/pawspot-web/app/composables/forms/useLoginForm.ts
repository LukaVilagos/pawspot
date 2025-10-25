import type { LoginUserRequest } from "@pawspot/api-contracts";
import { toTypedSchema } from "@vee-validate/zod";
import { LoginFormSchema } from "~/utils/validation/loginSchema";

export const useLoginForm = () => {
    const authStore = useAuthStore();
    const validationSchema = toTypedSchema(LoginFormSchema);
    const { handleSubmit, errors, defineField, isSubmitting } = useForm({
        validationSchema,
    });
    const [email, emailAttrs] = defineField('email');
    const [password, passwordAttrs] = defineField('password');


    const onSubmit = handleSubmit(async (values) => {
        const body: LoginUserRequest = {
            email: values.email,
            password: values.password,
        };

        await authStore.handleLogin(body);
    });

    const handleSubmitForm = async () => {
        await onSubmit();
    }

    return {
        email,
        emailAttrs,
        password,
        passwordAttrs,
        errors,
        isSubmitting,
        handleSubmitForm,
    };

}

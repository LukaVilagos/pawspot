<template>
    <UForm @submit="handleSubmitForm">
        <UFormField label="Email" :error="errors.email">
            <UInput v-model="email" v-bind="emailAttrs" type="email" placeholder="Enter your email" />
        </UFormField>
        <UFormField label="Password" :error="errors.password">
            <UInput v-model="password" v-bind="passwordAttrs" type="password" placeholder="Enter your password" />
        </UFormField>
        <UButton :loading="isSubmitting" type="submit">Login</UButton>
    </UForm>
</template>

<script setup lang="ts">
import { useLoginForm } from '~/composables/forms/useLoginForm';

const { email, emailAttrs, password, passwordAttrs, errors, isSubmitting, handleSubmitForm } = useLoginForm();
</script>
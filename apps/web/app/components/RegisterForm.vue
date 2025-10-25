<template>
    <UForm @submit="handleSubmitForm">
        <UFormField label="Name" :error="errors.name">
            <UInput v-model="name" v-bind="nameAttrs" type="text" placeholder="Enter your name" />
        </UFormField>
        <UFormField label="Email" :error="errors.email">
            <UInput v-model="email" v-bind="emailAttrs" type="email" placeholder="Enter your email" />
        </UFormField>
        <UFormField label="Password" :error="errors.password">
            <UInput v-model="password" v-bind="passwordAttrs" type="password" placeholder="Enter your password" />
        </UFormField>
        <UFormField label="Confirm Password" :error="errors.confirmPassword">
            <UInput v-model="confirmPassword" v-bind="confirmPasswordAttrs" type="password" placeholder="Confirm your password" />
        </UFormField>
        <UButton :loading="isSubmitting" type="submit">Register</UButton>
    </UForm>
</template>

<script setup lang="ts">
import { useRegisterForm } from '~/composables/forms/useRegisterForm';

const { name, nameAttrs, email, emailAttrs, password, passwordAttrs, confirmPassword, confirmPasswordAttrs, errors, isSubmitting, handleSubmitForm } = useRegisterForm();
</script>
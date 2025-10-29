<template>
    <div class="min-h-screen flex items-center justify-center">
        <LoginForm :is-admin="true"/>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['guest'],
})
</script>
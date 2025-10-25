<template>
  <div>
    <h1>Register</h1>
    <RegisterForm />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["guest"],
});
</script>

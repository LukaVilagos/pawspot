<template>
  <div>
    <h1>Login</h1>
    <LoginForm />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["guest"],
});
</script>

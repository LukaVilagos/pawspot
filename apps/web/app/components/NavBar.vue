<template>
  <nav>
    <ul class="flex space-x-4 p-4">
      <li><NuxtLink to="/">Home</NuxtLink></li>
      <li><NuxtLink to="/users">Users</NuxtLink></li>
      <li v-if="!isAuthenticated"><NuxtLink to="/login">Login</NuxtLink></li>
      <li v-if="!isAuthenticated">
        <NuxtLink to="/register">Register</NuxtLink>
      </li>
      <li v-if="isAuthenticated">
        <UButton label="Logout" @click="handleLogout" />
      </li>
      <li v-if="isAuthenticated && authUser">
        <span>Welcome, {{ authUser.name }}!</span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";

const auth = useAuth();
const isAuthenticated = computed(() => auth.loggedIn.value);
const authUser = auth.user;

const handleLogout = async () => {
  await auth.logout();
};
</script>

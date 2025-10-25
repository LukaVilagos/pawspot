<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Users</h1>
    <div v-if="loading" class="text-gray-500">Loading users...</div>
    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>
    <div v-else>
      <ul class="space-y-2">
        <li v-for="user in users" :key="user.id" class="border p-3 rounded">
          <div class="font-semibold">{{ user.name || "No name" }}</div>
          <div class="text-sm text-gray-600">{{ user.email }}</div>
          <div class="text-xs text-gray-400">ID: {{ user.id }}</div>
          <div><NuxtLink :to="`/users/${user.id}`">View Profile</NuxtLink></div>
        </li>
      </ul>

      <div class="mt-4 text-sm text-gray-500">Total users: {{ userCount }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const { users, loading, error, userCount } = storeToRefs(userStore);
await callOnce("users", () => userStore.fetchUsers());
</script>

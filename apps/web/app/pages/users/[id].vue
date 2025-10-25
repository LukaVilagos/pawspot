<template>
  <div>
    <h1>User Profile</h1>
    <div v-if="error">
      <p class="text-red-500">{{ error }}</p>
    </div>
    <div v-if="loading">
      <p>Loading user data...</p>
    </div>
    <div v-else-if="user">
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Name:</strong> {{ user.name }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["authenticated"],
});

const userStore = useUserStore();
const route = useRoute();
const userId = route.params.id as string;
const { user, loading, error } = storeToRefs(userStore);

await userStore.fetchUserById(userId);
</script>

<template>
    <div>
        <h1>User Profile</h1>
        <div v-if="userStore.error">
            <p class="text-red-500">{{ userStore.error }}</p>
        </div>
        <div v-if="userStore.loading">
            <p>Loading user data...</p>
        </div>
        <div v-else-if="user">
        <p><strong>ID:</strong> {{ user.id }}</p>
        <p><strong>Name:</strong> {{ user.name }}</p>
    </div>
    </div>
</template>

<script lang="ts" setup>
const userStore = useUserStore();
const route = useRoute();
const userId = route.params.id as string;

await callOnce('user', () => userStore.fetchUserById(userId), { mode: 'navigation' })
const user = computed(() => userStore.user);
</script>
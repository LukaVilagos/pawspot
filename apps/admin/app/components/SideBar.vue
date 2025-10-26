<template>
    <div class="bg-blue-900 p-4">
        <nav>
            <ul class="flex flex-col gap-4">
                <li>
                    <NuxtLink to="/">Dashboard</NuxtLink>
                </li>
                <li>
                    <UButton label="LogOut" @click="logout" v-if="loggedIn" />
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup lang="ts">
const { loggedIn, logout } = useAuth();
</script>

<template>
    <UNavigationMenu
        orientation="vertical"
        :items="items"
        class="data-[orientation=vertical]:w-48 h-full flex flex-col"
    >
        <template #list-trailing>
            <div class="mt-auto p-2">
                <UButton label="Log out" @click="logout" v-if="loggedIn" class="w-full" />
            </div>
        </template>
    </UNavigationMenu>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { loggedIn, logout } = useAuth();

const items = ref<NavigationMenuItem[][]>([
    [
        { label: 'Dashboard', to: '/' },
        { label: 'Users', to: '/user' },
    ],
]);
</script>

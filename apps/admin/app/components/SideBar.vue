<template>
    <UDashboardSidebar resizable collapsible>
        <template #header="{ collapsed }">
            <div class="w-full flex items-center gap-3">
                <div class="flex items-center gap-2">
                    <UIcon name="i-mdi-paw" class="size-5 text-primary" />
                    <span v-if="!collapsed" class="font-semibold">PawSpot</span>
                </div>
            </div>
        </template>

        <template #default="{ collapsed }">
            <div class="flex flex-col gap-2">
                <UNavigationMenu :collapsed="collapsed" :items="items[0]" orientation="vertical" />

                <UNavigationMenu :collapsed="collapsed" :items="items[1]" orientation="vertical" class="mt-auto" />
            </div>
        </template>

        <template #footer="{ collapsed }">
            <div class="w-full flex flex-col gap-2">
                <UButton v-if="loggedIn" :avatar="userAvatar ? { src: userAvatar } : undefined"
                    :label="collapsed ? undefined : userName" color="neutral" variant="ghost" class="w-full" />

                <div class="pt-1">
                    <UButton label="Log out" @click="logout" color="error" variant="subtle" class="w-full"
                        v-if="loggedIn" />
                </div>
            </div>
        </template>
    </UDashboardSidebar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { NavigationMenuItem } from '@nuxt/ui'

const { loggedIn, logout, user } = useAuth();

const userName = computed(() => (user)?.value?.name ?? 'Admin');
const userAvatar = computed(() => (user)?.value?.avatar ?? undefined);

const items = ref<NavigationMenuItem[][]>([
    [
        { label: 'Dashboard', to: '/', icon: 'i-lucide-home' },
        { label: 'Users', to: '/user', icon: 'i-lucide-users' },
        { label: 'Sanctuaries', to: '/sanctuary', icon: 'i-lucide-map-pin' },
        { label: 'Animals', to: '/animal', icon: 'i-mdi-paw' },
        { label: 'Posts', to: '/post', icon: 'i-lucide-file-text' },
    ],
])
</script>

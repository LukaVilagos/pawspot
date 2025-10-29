<template>
    <Edit 
      :item="user ?? ({} as Record<string, any>)"
      :fields="items"
      :loading="userStore.isLoading"
      :error="userStore.error"
      @saved="onSaved"
      @cancel="onCancel"
    />
</template>

<script setup lang="ts">
import type { UserResponse } from '@pawspot/api-contracts';
import type { EditPageItem } from '~/components/Edit.vue';

const route = useRoute();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const router = useRouter();

await userStore.fetchUserById(String(route.params.id));

const onSaved = (payload: any) => {
    userStore.updateUser(String(user?.value?.id), payload);
    router.push('/user');
};

const onCancel = () => {
    router.push('/user');
};

const items: EditPageItem<UserResponse>[] = [
    { accessorKey: 'email', header: 'Email', type: 'text' },
    { accessorKey: 'name', header: 'Name', type: 'text' },
];
</script>
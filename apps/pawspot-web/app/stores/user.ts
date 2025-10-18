import type { UsersListResponseDto } from "@pawspot/api-contracts";
import { useUserApi } from "~/composables/useUserApi";

export const useUserStore = defineStore('user', () => {
    const users = ref<UsersListResponseDto>([]);
    const userCount = computed(() => users.value.length);
    const loading = ref(true);
    const error = ref<string | null>(null);

    const { getAllUsers } = useUserApi();

    const fetchUsers = async () => {
        loading.value = true;
        error.value = null;

        try {
            const data = await getAllUsers();
            users.value = data || [];
        } catch (e) {
            error.value = 'Failed to fetch users';
            console.error(e);
        } finally {
            loading.value = false;
        }
    };

    return {
        users,
        userCount,
        loading,
        error,
        fetchUsers,
    };
});

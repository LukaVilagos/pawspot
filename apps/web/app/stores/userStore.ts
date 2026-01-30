import type { UserResponse, UsersListResponse } from "@pawspot/api-contracts";
import { useUserApi } from "~/composables/useUserApi";

export const useUserStore = defineStore("user", () => {
  const users = ref<UsersListResponse>([]);
  const user = ref<UserResponse | null>(null);
  const userCount = computed(() => users.value.length);
  const loading = ref(true);
  const error = ref<string | null>(null);

  const { getAllUsers, getUserById } = useUserApi();

  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;

    try {
      const data = await getAllUsers();
      users.value = data.data.value || [];
    } catch (e) {
      error.value = "Failed to fetch users";
    } finally {
      loading.value = false;
    }
  };

  const fetchUserById = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const data = await getUserById(id);
      user.value = data.data.value || null;
    } catch (e) {
      error.value = "Failed to fetch user";
      user.value = null;
    } finally {
      loading.value = false;
    }
  };

  return {
    users,
    userCount,
    loading,
    error,
    user,
    fetchUsers,
    fetchUserById,
  };
});

import type {
    UserResponse,
    CreateUserRequest,
    UpdateUserRequest,
    QueryOptions,
    PaginatedResponse,
} from '@pawspot/api-contracts'
import { normalizeApiError } from '~/utils/error'

export const useUserStore = defineStore('user', () => {
    const user = ref<UserResponse | null>(null)
    const searchResult = ref<PaginatedResponse<UserResponse>>({
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
    })
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const lastQuery = ref<string | null>(null)

    function setUser(newUser: UserResponse | null) {
        user.value = newUser
    }

    function setSearchResult(newResult: PaginatedResponse<UserResponse>) {
        searchResult.value = newResult
    }

    async function fetchUserById(id: string) {
        isLoading.value = true
        error.value = null
        try {
            const api = useUserApi()
            const res = await api.getUserById(id)
            const data = res?.data?.value
            setUser(data ?? null)
            return data ?? null
        } catch (e: any) {
            error.value = e?.message ?? String(e)
            throw normalizeApiError(e)
        } finally {
            isLoading.value = false
        }
    }

    async function updateUser(id: string, payload: UpdateUserRequest) {
        isLoading.value = true
        error.value = null
        try {
            const api = useUserApi()
            const res = await api.updateUser(id, payload)
            const data = res?.data?.value
            if (data) {
                searchResult.value = {
                    ...searchResult.value,
                    items: searchResult.value.items.map((u) => (u.id === data.id ? data : u)),
                }
                if (user.value?.id === data.id) user.value = data
                return data
            }
            throw new Error('No data returned from API')
        } catch (e: any) {
            error.value = e?.response?.data?.message ?? e?.message ?? String(e)
            throw normalizeApiError(e)
        } finally {
            isLoading.value = false
        }
    }

    async function createUser(payload: CreateUserRequest) {
        isLoading.value = true
        error.value = null
        try {
            const api = useUserApi()
            const res = await api.createUser(payload)
            const data = res?.data?.value
            if (data) {
                searchResult.value = { ...searchResult.value, items: [data, ...searchResult.value.items] }
                return data
            }
            throw new Error('No data returned from API')
        } catch (e: any) {
            error.value = e?.response?.data?.message ?? e?.message ?? String(e)
            throw normalizeApiError(e)
        } finally {
            isLoading.value = false
        }
    }

    async function deleteUser(id: string) {
        isLoading.value = true
        error.value = null
        try {
            const api = useUserApi()
            await api.deleteUser(id)
            searchResult.value = {
                ...searchResult.value,
                items: searchResult.value.items.filter((u) => u.id !== id),
            }
            if (user.value?.id === id) user.value = null
            return true
        } catch (e: any) {
            error.value = e?.message ?? String(e)
            throw normalizeApiError(e)
        } finally {
            isLoading.value = false
        }
    }

    async function searchUsers(query: QueryOptions<UserResponse>) {
        const queryString = JSON.stringify(query)
        if (queryString === lastQuery.value) {
            return searchResult.value
        }

        isLoading.value = true
        error.value = null
        lastQuery.value = queryString

        try {
            const api = useUserApi()
            const data = await api.searchUsers(query)
            if (data) {
                setSearchResult(data)
            }
            return data
        } catch (e: any) {
            error.value = e?.message ?? String(e)
            throw normalizeApiError(e)
        } finally {
            isLoading.value = false
        }
    }

    return {
        isLoading,
        error,
        user,
        searchResult,
        setUser,
        setSearchResult,
        fetchUserById,
        createUser,
        updateUser,
        deleteUser,
        searchUsers,
    }
})

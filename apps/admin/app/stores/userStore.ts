import type {
    UserResponse,
    CreateUserRequest,
    AdminUpdateUserRequest,
    QueryOptions,
    PaginatedResponse,
} from '@pawspot/api-contracts'
import { normalizeApiError } from '~/utils/error'
import { invalidateStoreCache } from '~/utils/storeUtils'

export const useUserStore = defineStore('user', () => {
    const user = ref<UserResponse | null>(null)
    const searchResult = ref<PaginatedResponse<UserResponse>>({
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
    })
    const isLoading = ref(true)
    const hasInitiallyLoaded = ref(false)
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

            if (res.error.value) {
                error.value = res.error.value?.message ?? String(res.error.value)
                throw normalizeApiError(res.error.value)
            }
            
            const data = res.data.value
            setUser(data ?? null)
            return data ?? null
        } catch (e: any) {
            if (!error.value) {
                error.value = e?.message ?? String(e)
            }
            throw normalizeApiError(e)
        } finally {
            isLoading.value = false
        }
    }

    async function updateUser(id: string, payload: AdminUpdateUserRequest) {
        isLoading.value = true
        error.value = null
        try {
            const api = useUserApi()
            const data = await api.updateUser(id, payload)
            if (data) {
                if (user.value?.id === data.id) user.value = data
                invalidateStoreCache({ searchResult, lastQuery, hasInitiallyLoaded, isLoading })
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
            const data = await api.createUser(payload)
            if (data) {
                invalidateStoreCache({ searchResult, lastQuery, hasInitiallyLoaded, isLoading })
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
            if (user.value?.id === id) user.value = null
            invalidateStoreCache({ searchResult, lastQuery, hasInitiallyLoaded, isLoading })
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
        if (queryString === lastQuery.value && hasInitiallyLoaded.value) {
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
            hasInitiallyLoaded.value = true
        }
    }

    return {
        isLoading,
        hasInitiallyLoaded,
        error,
        user,
        searchResult,
        lastQuery,
        setUser,
        setSearchResult,
        fetchUserById,
        createUser,
        updateUser,
        deleteUser,
        searchUsers,
    }
})

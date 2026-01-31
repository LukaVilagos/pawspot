import type {
    SanctuaryResponse,
    CreateSanctuaryRequest,
    UpdateSanctuaryRequest,
    QueryOptions,
    PaginatedResponse,
    UserSummary,
} from '@pawspot/api-contracts'
import { normalizeApiError } from '~/utils/error'
import { invalidateStoreCache } from '~/utils/storeUtils'

export const useSanctuaryStore = defineStore('sanctuary', () => {
    const sanctuary = ref<SanctuaryResponse | null>(null)
    const searchResult = ref<PaginatedResponse<SanctuaryResponse>>({
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

    function setSanctuary(newSanctuary: SanctuaryResponse | null) {
        sanctuary.value = newSanctuary
    }

    function setSearchResult(newResult: PaginatedResponse<SanctuaryResponse>) {
        searchResult.value = newResult
    }

    async function fetchSanctuaryById(id: string) {
        isLoading.value = true
        error.value = null
        try {
            const api = useSanctuaryApi()
            const res = await api.getSanctuaryById(id)

            if (res.error.value) {
                error.value = res.error.value?.message ?? String(res.error.value)
                throw normalizeApiError(res.error.value)
            }

            const data = res.data.value
            setSanctuary(data ?? null)
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

    async function updateSanctuary(id: string, payload: UpdateSanctuaryRequest) {
        isLoading.value = true
        error.value = null
        try {
            const api = useSanctuaryApi()
            const data = await api.updateSanctuary(id, payload)
            if (data) {
                if (sanctuary.value?.id === data.id) sanctuary.value = data
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

    async function createSanctuary(payload: CreateSanctuaryRequest) {
        isLoading.value = true
        error.value = null
        try {
            const api = useSanctuaryApi()
            const data = await api.createSanctuary(payload)
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

    async function deleteSanctuary(id: string) {
        isLoading.value = true
        error.value = null
        try {
            const api = useSanctuaryApi()
            await api.deleteSanctuary(id)
            if (sanctuary.value?.id === id) sanctuary.value = null
            invalidateStoreCache({ searchResult, lastQuery, hasInitiallyLoaded, isLoading })
            return true
        } catch (e: any) {
            error.value = e?.message ?? String(e)
            throw normalizeApiError(e)
        } finally {
            isLoading.value = false
        }
    }

    async function searchSanctuaries(query: QueryOptions<SanctuaryResponse>) {
        const queryString = JSON.stringify(query)
        if (queryString === lastQuery.value && hasInitiallyLoaded.value) {
            return searchResult.value
        }

        isLoading.value = true
        error.value = null
        lastQuery.value = queryString

        try {
            const api = useSanctuaryApi()
            const data = await api.searchSanctuaries(query)
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

    async function fetchSanctuaries() {
        return searchSanctuaries({ page: 1, limit: 1000 })
    }

    const sanctuaries = computed(() => searchResult.value.items)

    async function addContributor(sanctuaryId: string, userId: string) {
        isLoading.value = true
        error.value = null
        try {
            const api = useSanctuaryApi()
            const data = await api.addContributor(sanctuaryId, userId)
            if (data && sanctuary.value?.id === sanctuaryId) {
                sanctuary.value = data
            }
            return data
        } catch (e: any) {
            error.value = e?.message ?? String(e)
            throw normalizeApiError(e)
        } finally {
            isLoading.value = false
        }
    }

    async function removeContributor(sanctuaryId: string, userId: string) {
        isLoading.value = true
        error.value = null
        try {
            const api = useSanctuaryApi()
            const data = await api.removeContributor(sanctuaryId, userId)
            if (data && sanctuary.value?.id === sanctuaryId) {
                sanctuary.value = data
            }
            return data
        } catch (e: any) {
            error.value = e?.message ?? String(e)
            throw normalizeApiError(e)
        } finally {
            isLoading.value = false
        }
    }

    async function searchContributors(sanctuaryId: string, query: QueryOptions<UserSummary>) {
        try {
            const api = useSanctuaryApi()
            return await api.searchContributors(sanctuaryId, query)
        } catch (e: any) {
            error.value = e?.message ?? String(e)
            throw normalizeApiError(e)
        }
    }

    async function generateQrCode(sanctuaryId: string) {
        isLoading.value = true
        error.value = null
        try {
            const api = useSanctuaryApi()
            const data = await api.generateQrCode(sanctuaryId)
            if (data && sanctuary.value?.id === sanctuaryId) {
                sanctuary.value = data
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
        hasInitiallyLoaded,
        error,
        sanctuary,
        sanctuaries,
        searchResult,
        lastQuery,
        setSanctuary,
        setSearchResult,
        fetchSanctuaryById,
        fetchSanctuaries,
        createSanctuary,
        updateSanctuary,
        deleteSanctuary,
        searchSanctuaries,
        addContributor,
        removeContributor,
        searchContributors,
        generateQrCode,
    }
})

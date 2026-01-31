import type {
    AnimalResponse,
    CreateAnimalRequest,
    UpdateAnimalRequest,
    QueryOptions,
    PaginatedResponse,
} from '@pawspot/api-contracts'
import { normalizeApiError } from '~/utils/error'
import { invalidateStoreCache } from '~/utils/storeUtils'

export const useAnimalStore = defineStore('animal', () => {
    const animal = ref<AnimalResponse | null>(null)
    const searchResult = ref<PaginatedResponse<AnimalResponse>>({
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

    function setAnimal(newAnimal: AnimalResponse | null) {
        animal.value = newAnimal
    }

    function setSearchResult(newResult: PaginatedResponse<AnimalResponse>) {
        searchResult.value = newResult
    }

    async function fetchAnimalById(id: string) {
        isLoading.value = true
        error.value = null
        try {
            const api = useAnimalApi()
            const res = await api.getAnimalById(id)

            if (res.error.value) {
                error.value = res.error.value?.message ?? String(res.error.value)
                throw normalizeApiError(res.error.value)
            }

            const data = res.data.value
            setAnimal(data ?? null)
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

    async function updateAnimal(id: string, payload: UpdateAnimalRequest) {
        isLoading.value = true
        error.value = null
        try {
            const api = useAnimalApi()
            const data = await api.updateAnimal(id, payload)
            if (data) {
                if (animal.value?.id === data.id) animal.value = data
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

    async function createAnimal(payload: CreateAnimalRequest) {
        isLoading.value = true
        error.value = null
        try {
            const api = useAnimalApi()
            const data = await api.createAnimal(payload)
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

    async function deleteAnimal(id: string) {
        isLoading.value = true
        error.value = null
        try {
            const api = useAnimalApi()
            await api.deleteAnimal(id)
            if (animal.value?.id === id) animal.value = null
            invalidateStoreCache({ searchResult, lastQuery, hasInitiallyLoaded, isLoading })
            return true
        } catch (e: any) {
            error.value = e?.message ?? String(e)
            throw normalizeApiError(e)
        } finally {
            isLoading.value = false
        }
    }

    async function searchAnimals(query: QueryOptions<AnimalResponse>) {
        const queryString = JSON.stringify(query)
        if (queryString === lastQuery.value && hasInitiallyLoaded.value) {
            return searchResult.value
        }

        isLoading.value = true
        error.value = null
        lastQuery.value = queryString

        try {
            const api = useAnimalApi()
            const data = await api.searchAnimals(query)
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
        animal,
        searchResult,
        lastQuery,
        setAnimal,
        setSearchResult,
        fetchAnimalById,
        createAnimal,
        updateAnimal,
        deleteAnimal,
        searchAnimals,
    }
})

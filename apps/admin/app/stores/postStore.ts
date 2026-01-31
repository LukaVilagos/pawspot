import type {
    PostResponse,
    CreatePostRequest,
    UpdatePostRequest,
    QueryOptions,
    PaginatedResponse,
} from '@pawspot/api-contracts'
import { normalizeApiError } from '~/utils/error'
import { invalidateStoreCache } from '~/utils/storeUtils'

export const usePostStore = defineStore('post', () => {
    const post = ref<PostResponse | null>(null)
    const searchResult = ref<PaginatedResponse<PostResponse>>({
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

    function setPost(newPost: PostResponse | null) {
        post.value = newPost
    }

    function setSearchResult(newResult: PaginatedResponse<PostResponse>) {
        searchResult.value = newResult
    }

    async function fetchPostById(id: string) {
        isLoading.value = true
        error.value = null
        try {
            const api = usePostApi()
            const res = await api.getPostById(id)

            if (res.error.value) {
                error.value = res.error.value?.message ?? String(res.error.value)
                throw normalizeApiError(res.error.value)
            }

            const data = res.data.value
            setPost(data ?? null)
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

    async function updatePost(id: string, payload: UpdatePostRequest) {
        isLoading.value = true
        error.value = null
        try {
            const api = usePostApi()
            const data = await api.updatePost(id, payload)
            if (data) {
                if (post.value?.id === data.id) post.value = data
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

    async function createPost(payload: CreatePostRequest) {
        isLoading.value = true
        error.value = null
        try {
            const api = usePostApi()
            const data = await api.createPost(payload)
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

    async function deletePost(id: string) {
        isLoading.value = true
        error.value = null
        try {
            const api = usePostApi()
            await api.deletePost(id)
            if (post.value?.id === id) post.value = null
            invalidateStoreCache({ searchResult, lastQuery, hasInitiallyLoaded, isLoading })
            return true
        } catch (e: any) {
            error.value = e?.message ?? String(e)
            throw normalizeApiError(e)
        } finally {
            isLoading.value = false
        }
    }

    async function searchPosts(query: QueryOptions<PostResponse>) {
        const queryString = JSON.stringify(query)
        if (queryString === lastQuery.value && hasInitiallyLoaded.value) {
            return searchResult.value
        }

        isLoading.value = true
        error.value = null
        lastQuery.value = queryString

        try {
            const api = usePostApi()
            const data = await api.searchPosts(query)
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
        post,
        searchResult,
        lastQuery,
        setPost,
        setSearchResult,
        fetchPostById,
        createPost,
        updatePost,
        deletePost,
        searchPosts,
    }
})

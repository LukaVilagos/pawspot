import type {
    AuditLogResponse,
    QueryOptions,
    PaginatedResponse,
} from '@pawspot/api-contracts'
import { normalizeApiError } from '~/utils/error'

export const useAuditLogStore = defineStore('auditLog', () => {
    const auditLog = ref<AuditLogResponse | null>(null)
    const searchResult = ref<PaginatedResponse<AuditLogResponse>>({
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

    function setAuditLog(newAuditLog: AuditLogResponse | null) {
        auditLog.value = newAuditLog
    }

    function setSearchResult(newResult: PaginatedResponse<AuditLogResponse>) {
        searchResult.value = newResult
    }

    async function fetchAuditLogById(id: string) {
        isLoading.value = true
        error.value = null
        try {
            const api = useAuditLogApi()
            const res = await api.getAuditLogById(id)

            if (res.error.value) {
                error.value = res.error.value?.message ?? String(res.error.value)
                throw normalizeApiError(res.error.value)
            }

            const data = res.data.value
            setAuditLog(data ?? null)
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

    async function searchAuditLogs(query: QueryOptions<AuditLogResponse>) {
        const queryString = JSON.stringify(query)
        if (queryString === lastQuery.value && hasInitiallyLoaded.value) {
            return searchResult.value
        }

        isLoading.value = true
        error.value = null
        lastQuery.value = queryString

        try {
            const api = useAuditLogApi()
            const data = await api.searchAuditLogs(query)
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
        auditLog,
        searchResult,
        lastQuery,
        setAuditLog,
        setSearchResult,
        fetchAuditLogById,
        searchAuditLogs,
    }
})

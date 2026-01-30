import type { PaginatedResponse, QueryOptions } from '@pawspot/api-contracts'

export interface PaginatedStore<T> {
    searchResult: Ref<PaginatedResponse<T>>
    lastQuery: Ref<string | null>
    hasInitiallyLoaded: Ref<boolean>
    isLoading: Ref<boolean>
}

export function invalidateStoreCache<T>(store: PaginatedStore<T>): void {
    store.lastQuery.value = null
    store.hasInitiallyLoaded.value = false
    store.isLoading.value = true
}

export function buildCurrentQuery<T>(searchResult: PaginatedResponse<T>): QueryOptions<T> {
    return {
        page: searchResult.page,
        limit: searchResult.limit,
    }
}

import type { UseFetchOptions } from '#app'

/**
 * Custom useFetch wrapper that uses $fetch internally
 * which already has 401 error handling via the plugin
 */
export const useAuthFetch = <T>(
    url: string,
    options?: UseFetchOptions<T>
) => {
    return useFetch<T>(url, options)
}

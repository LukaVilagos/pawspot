import type { RouteLocationNormalizedLoadedGeneric, Router } from 'vue-router'

export function getStringQueryParam(route: RouteLocationNormalizedLoadedGeneric, key: string): string | undefined {
    const value = route.query[key]
    return typeof value === 'string' ? value : undefined
}

export function getReturnUrl(route: RouteLocationNormalizedLoadedGeneric): string | undefined {
    return getStringQueryParam(route, 'returnUrl')
}

export function getPrefilledId(route: RouteLocationNormalizedLoadedGeneric, key: string): string | undefined {
    return getStringQueryParam(route, key)
}

export function getRouteId(route: RouteLocationNormalizedLoadedGeneric, paramName: string = 'id'): string {
    const id = route.params[paramName]
    return Array.isArray(id) ? id[0] ?? '' : id ?? ''
}

export function buildUrlWithParams(basePath: string, params?: Record<string, string | undefined>): string {
    if (!params) return basePath
    
    const urlParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
            urlParams.set(key, value)
        }
    }
    
    const queryString = urlParams.toString()
    return queryString ? `${basePath}?${queryString}` : basePath
}

export function appendReturnUrl(path: string, returnUrl?: string): string {
    if (!returnUrl) return path
    const separator = path.includes('?') ? '&' : '?'
    return `${path}${separator}returnUrl=${encodeURIComponent(returnUrl)}`
}

export function navigateToRedirect(
    router: Router,
    options: {
        returnUrl?: string
        fallbackPath: string
        additionalFallbacks?: string[]
    }
): void {
    const { returnUrl, fallbackPath, additionalFallbacks = [] } = options
    
    if (returnUrl) {
        router.push(returnUrl)
        return
    }
    
    for (const fallback of additionalFallbacks) {
        if (fallback) {
            router.push(fallback)
            return
        }
    }
    
    router.push(fallbackPath)
}

export interface CrudNavigationOptions {
    router: Router
    basePath: string
    entityId?: string
    returnUrl?: string
    prefilledParentId?: string
    prefilledParentPath?: string
}

export interface CrudNavigationHandlers {
    navigateToEdit: () => void
    navigateToView: () => void
    navigateAfterCreate: (createdId: string) => void
    navigateAfterDelete: () => void
    navigateOnCancel: () => void
}

export function createCrudNavigation(options: CrudNavigationOptions): CrudNavigationHandlers {
    const { router, basePath, entityId, returnUrl, prefilledParentId, prefilledParentPath } = options
    
    return {
        navigateToEdit: () => {
            const editPath = `${basePath}/${entityId}/edit/`
            router.push(appendReturnUrl(editPath, returnUrl))
        },
        
        navigateToView: () => {
            const viewPath = `${basePath}/${entityId}`
            router.push(appendReturnUrl(viewPath, returnUrl))
        },
        
        navigateAfterCreate: (createdId: string) => {
            if (returnUrl) {
                router.push(returnUrl)
            } else {
                router.push(`${basePath}/${createdId}`)
            }
        },
        
        navigateAfterDelete: () => {
            if (returnUrl) {
                router.push(returnUrl)
            } else {
                router.push(basePath)
            }
        },
        
        navigateOnCancel: () => {
            if (returnUrl) {
                router.push(returnUrl)
            } else if (prefilledParentId && prefilledParentPath) {
                router.push(`${prefilledParentPath}/${prefilledParentId}`)
            } else {
                router.push(basePath)
            }
        }
    }
}

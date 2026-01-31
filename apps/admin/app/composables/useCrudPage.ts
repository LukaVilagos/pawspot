import type { RouteLocationNormalizedLoadedGeneric, Router } from 'vue-router'
import {
    getReturnUrl,
    getPrefilledId,
    getRouteId,
    createCrudNavigation,
    type CrudNavigationHandlers
} from '~/utils/urlParams'

export interface UseCrudPageOptions {
    basePath: string
    prefilledIdKey?: string
    prefilledParentPath?: string
    routeParamName?: string
}

export interface UseCrudPageReturn {
    entityId: ComputedRef<string>
    returnUrl: ComputedRef<string | undefined>
    prefilledId: ComputedRef<string | undefined>
    navigation: ComputedRef<CrudNavigationHandlers>
    navigateToEdit: () => void
    navigateAfterCreate: (createdId: string, passedReturnUrl?: string) => void
    navigateAfterDelete: (passedReturnUrl?: string) => void
    navigateOnCancel: (passedReturnUrl?: string) => void
}

export function useCrudPage(options: UseCrudPageOptions): UseCrudPageReturn {
    const route = useRoute()
    const router = useRouter()
    
    const entityId = computed(() => getRouteId(route, options.routeParamName ?? 'id'))
    const returnUrl = computed(() => getReturnUrl(route))
    const prefilledId = computed(() => 
        options.prefilledIdKey ? getPrefilledId(route, options.prefilledIdKey) : undefined
    )
    
    const navigation = computed(() => createCrudNavigation({
        router,
        basePath: options.basePath,
        entityId: entityId.value,
        returnUrl: returnUrl.value,
        prefilledParentId: prefilledId.value,
        prefilledParentPath: options.prefilledParentPath
    }))
    
    const navigateToEdit = () => {
        navigation.value.navigateToEdit()
    }
    
    const navigateAfterCreate = (createdId: string, passedReturnUrl?: string) => {
        const redirectTarget = passedReturnUrl || returnUrl.value
        if (redirectTarget) {
            router.push(redirectTarget)
        } else {
            router.push(`${options.basePath}/${createdId}`)
        }
    }
    
    const navigateAfterDelete = (passedReturnUrl?: string) => {
        const redirectTarget = passedReturnUrl || returnUrl.value
        if (redirectTarget) {
            router.push(redirectTarget)
        } else {
            router.push(options.basePath)
        }
    }
    
    const navigateOnCancel = (passedReturnUrl?: string) => {
        const redirectTarget = passedReturnUrl || returnUrl.value
        if (redirectTarget) {
            router.push(redirectTarget)
        } else if (prefilledId.value && options.prefilledParentPath) {
            router.push(`${options.prefilledParentPath}/${prefilledId.value}`)
        } else {
            router.push(options.basePath)
        }
    }
    
    return {
        entityId,
        returnUrl,
        prefilledId,
        navigation,
        navigateToEdit,
        navigateAfterCreate,
        navigateAfterDelete,
        navigateOnCancel
    }
}

export function usePrefilledValues<T extends Record<string, any>>(
    prefilledMappings: Record<string, ComputedRef<string | undefined>>
): ComputedRef<Partial<T>> {
    return computed(() => {
        const values: Partial<T> = {}
        for (const [key, valueRef] of Object.entries(prefilledMappings)) {
            if (valueRef.value) {
                (values as any)[key] = valueRef.value
            }
        }
        return values
    })
}

export default defineNuxtRouteMiddleware((to) => {
    if (to.path === '/login' || (to.meta && Array.isArray(to.meta.middleware) && to.meta.middleware.includes('guest'))) {
        return
    }

    const { loggedIn } = useUserSession()

    if (!loggedIn.value) {
        return navigateTo('/login')
    }
})

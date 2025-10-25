export default defineNuxtPlugin((nuxtApp) => {
    const authStore = useAuthStore()

    nuxtApp.$fetch = (url: string, options: any = {}) => {
        const token = authStore.authToken
        options.headers = options.headers || {}
        if (token) {
            options.headers.Authorization = `Bearer ${token}`
        }
        console.log('Fetching token:', token)
        return $fetch(url, options)
    }
})

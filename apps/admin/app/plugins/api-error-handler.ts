export default defineNuxtPlugin({
    name: 'api-error-handler',
    enforce: 'pre',
    setup() {
        const router = useRouter()
        const { clear } = useUserSession()

        const handleUnauthorized = async () => {
            if (router.currentRoute.value.path === '/login') return
            
            await clear()
            await navigateTo('/login', { replace: true })
        }

        if (process.client) {
            const customFetch = $fetch.create({
                async onResponseError({ response }) {
                    if (response.status === 401) {
                        await handleUnauthorized()
                    }
                }
            })
            globalThis.$fetch = customFetch
        }

        return {
            provide: {
                handleApiError: async (error: any) => {
                    const status = error?.response?.status || error?.statusCode || error?.status
                    if (status === 401) {
                        await handleUnauthorized()
                    }
                }
            }
        }
    }
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui', '@vueuse/nuxt'],
  extends: "../web",
  devServer: {
    port: 3002,
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || "http://localhost:3000",
    },
  },
})
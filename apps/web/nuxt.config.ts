// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@pinia/nuxt",
    "@vee-validate/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "nuxt-auth-utils",
  ],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || "http://localhost:3000",
    },
  },
  devServer: {
    port: 3001,
  },
  pinia: {
    storesDirs: ["app/stores"],
  },
  veeValidate: {
    autoImports: true,
  },
});

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['@/assets/css/main.scss', 'vue-toastification/dist/index.css'],
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  plugins: [
    "@/plugins/mask"
  ],
  build: {
    transpile: ['vue-toastification'],
  },
  tailwindcss: {
    exposeConfig: false,
    injectPosition: 0,
    viewer: process.env.NODE_ENV !== 'production',
  },
  typescript: {
    shim: false
  },
  runtimeConfig: {
    // The private keys which are only available within server-side
    ZendeskToken: process.env.ZENDESK_API_TOKEN,
    ZendeskUser: process.env.ZENDESK_API_USER,
    // Keys within public, will be also exposed to the client-side
    public: {
      recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
    }
  }

})

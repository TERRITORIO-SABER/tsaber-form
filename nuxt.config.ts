// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['@/assets/css/main.scss', 'vue-toastification/dist/index.css'],
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/google-fonts'
  ],

  plugins: [{ src: '@/plugins/mask', mode: 'client' }, '@/plugins/recaptcha'],
  build: {
    transpile: ['vue-toastification'],
  },

  tailwindcss: {
    exposeConfig: false,
    injectPosition: 0,
    viewer: process.env.NODE_ENV !== 'production'
  },
  googleFonts: {
    families: {
      'Bricolage Grotesque': true,
      'Libre Franklin': true,
    }
  },
  typescript: {
    shim: false
  },
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
    }
  },
  runtimeConfig: {
    // The private keys which are only available within server-side
    ZendeskToken: process.env.ZENDESK_API_TOKEN,
    ZendeskUser: process.env.ZENDESK_API_USER,
    // Keys within public, will be also exposed to the client-side
    public: {
      grecaptcha: {
        hideBadge: false,
        mode: 'base',
        siteKey: process.env.RECAPTCHA_SITE_KEY,
        version: 3
      }
    }
  }
})

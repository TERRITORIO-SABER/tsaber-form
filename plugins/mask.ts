import VueTheMask from 'vue-the-mask'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtPlugin((nuxtApp) => {
  // @ts-ignore 
  nuxtApp.vueApp.use(VueTheMask)
})
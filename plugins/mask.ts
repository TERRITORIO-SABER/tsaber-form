import {mask} from 'vue-the-mask'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtPlugin(({vueApp}) => {
  vueApp.directive('mask', mask)
})
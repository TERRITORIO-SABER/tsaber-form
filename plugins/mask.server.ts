// stub to fix getSSRProps error
export default defineNuxtPlugin(({vueApp}) => {
  vueApp.directive('mask', {})
})
<template>
  <HomeNavbar />
  <HomeForm />
</template>

<script setup>
onMounted(async () => {
  const nuxtApp = useNuxtApp()
  nuxtApp.$recaptcha.init()
})
</script>

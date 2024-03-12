<template>
  <div class="mx-auto max-w-2xl mb-12 px-4 pb-4 lg:px-8 bg-[#23282C] text-white">
    <HomeNavbar />
    <HomeForm />
  </div>
</template>

<script setup>
onMounted(async () => {
  const nuxtApp = useNuxtApp()
  nuxtApp.$recaptcha.init()
})
</script>

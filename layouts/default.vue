<script setup lang="ts">

useHead({
  htmlAttrs: {
    lang: 'pt-BR'
  },
  title: 'Atendimento Território Saber',
})

onMounted(async () => {
  const nuxtApp = useNuxtApp()
  nuxtApp.$recaptcha.init()
})
</script>

<template>
  <div class="mx-auto max-w-2xl mb-12 px-4 pb-4 lg:px-8 bg-[#23282C] text-white">
    <HomeNavbar />
    <slot></slot>
  </div>
</template>

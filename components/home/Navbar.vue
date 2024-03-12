<template>
  <!-- tailwind navbar element to show a brand -->
  <nav class="">
    <div class="mx-auto max-w-7xl">
      <div class="relative flex h-16 items-center justify-between">
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex flex-shrink-0 items-center">
            <img class="h-8 w-auto" height="8" src="/logo.png" alt="Território Saber">
          </div>

          <div class="hidden sm:ml-6 sm:block my-auto">
            <div class="flex space-x-4 text-white">
              <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
              Território Saber

            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'HomeNavbar'
}
</script>

<style scoped>
h1 {
  color: blue;
}
</style>

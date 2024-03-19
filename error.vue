<script setup>
onBeforeMount(() => {
  const error = useError();
  const router = useRouter()
  if (error.value.statusCode === 404) {
    router.push('/')
  }
})
</script>

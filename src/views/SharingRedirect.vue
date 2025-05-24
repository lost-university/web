<template>
  <div>Loading...</div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const slug = route.params.slug

  try {
    const response = await fetch(`/api/plans/shared/${slug}`);
    const data = await response.json();


    if (data.content) {
      await router.replace({ path: `/plan/${data.content}` })
    } else {
      // fallback for invalid slugs
      await router.replace({ path: '/' })
    }
  } catch (err) {
    console.error('Sharing link error:', err)
    await router.replace({ path: '/' }) // fallback on error
  }
})
</script>

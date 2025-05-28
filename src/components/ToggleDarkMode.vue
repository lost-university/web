<template>
  <button
    :aria-pressed="isDark.toString()"
    :class="[
      'p-2 transition-colors rounded-sm focus:outline-none ml-4 mr-4',
      isDark ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'
    ]"
    @click="toggleDark"
  >
    <span aria-hidden="true">
      {{ isDark ? '☀︎' : '⏾' }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const isDark = ref(false)

function applyClass(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
}

onMounted(() => {
  const saved = localStorage.getItem('dark-mode')
  isDark.value = saved !== null
    ? saved === 'true'
    : window.matchMedia('(prefers-color-scheme: dark)').matches

  applyClass(isDark.value)
})

watch(isDark, (val) => {
  applyClass(val)
  localStorage.setItem('dark-mode', String(val))
})

function toggleDark() {
  isDark.value = !isDark.value
}
</script>

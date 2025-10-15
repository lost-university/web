<template>
  <button
    class="fit-view-button w-auto h-auto bg-gray-800 rounded-full
    px-3 py-2 shadow hover:bg-gray-700 focus:outline-none flex items-center"
    data-cy="fit-view-button"
    aria-label="Fit View"
    @click="$emit('click')"
  >
    <span class="text-white text-sm mr-2 ml-2">alles einpassen</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M4 4h6M4 4v6M20 20h-6M20 20v-6"
      />
    </svg>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'FitViewButton',
  emits: ['click']
});
</script>
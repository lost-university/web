<template>
  <button
    class="fit-view-button absolute right-8 bottom-8 w-10 h-10 bg-gray-800 rounded-full p-2 shadow
             hover:bg-gray-700 focus:outline-none width-10 height-10"
    aria-label="Fit View"
    @click="$emit('click')"
  >
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
  
<style>
.fit-view-button {
  position: absolute;
  width: 40px !important;
  height: 40px;
}
</style>
<template>
  <div
    v-if="visible"
    class="absolute bg-gray-800 text-white text-sm px-4 py-2 rounded-lg
    shadow-[0_4px_12px_rgba(0,0,0,0.3)] whitespace-nowrap transform -translate-x-1/2 -translate-y-[160%]"
    :style="{
      top: y + 'px',
      left: x + 'px',
      zIndex: 1000,
      width: 'max-content'
    }"
  >
    <slot>
      Diese Abhängikeit ist Pflicht.
    </slot>
    <div
      class="absolute left-1/2 -bottom-1.5 transform -translate-x-1/2 w-0 h-0 border-l-6 
    border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-gray-800"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'GraphTooltip',
  props: {
    visible: { type: Boolean, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  }
};
</script>
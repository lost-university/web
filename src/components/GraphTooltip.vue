<template>
  <div
    v-if="visible"
    class="absolute bg-gray-800 text-white text-sm px-2 py-1 rounded shadow tooltip"
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
  
  <style scoped>
  .tooltip {
    position: absolute;
    background: #000;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transform: translate(-50%, -160%);
  }
  
  .tooltip::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -6px;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #000;
  }
  </style>
  
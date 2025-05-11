<template>
  <div
    class="node-wrapper"
    :class="{
      dimmed: activeHover && !highlightedNodes.has(id),
      inactive: !isPlanned
    }"
    @mouseover="() => emitHover(id)"
    @mouseleave="() => emitLeave()"
  >
    <ModuleComponent
      :id="Number(id)"
      :module="moduleData"
    />
  </div>
</template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import ModuleComponent from './GraphModule.vue';
  import { store } from '../helpers/store';
  import type { Node } from '@vue-flow/core';
  
  const props = defineProps<{
    props: Node & { data: { moduleData: unknown } };
    activeHover: boolean;
    highlightedNodes: Set<string>;
  }>();
  const emit = defineEmits<{
    (e: 'hover', id: string): void;
    (e: 'leave'): void;
  }>();
  
  const id = computed(() => props.props.id);
  const moduleData = computed(() => props.props.data.moduleData);  
  const isPlanned = computed(() =>
    (store.getters.allPlannedModuleIds as string[]).includes(id.value)
  );
  
  function emitHover(nodeId: string) {
    emit('hover', nodeId);
  }
  function emitLeave() {
    emit('leave');
  }
  </script>
  
  <style scoped>
  .node-wrapper {
    transition: filter 0.3s ease, opacity 0.3s ease;
  }
  
  .dimmed {
    filter: grayscale(100%);
    opacity: 0.1;
  }
  
  .inactive {
    filter: brightness(1);
    opacity: 0.2;
  }
  </style>
  
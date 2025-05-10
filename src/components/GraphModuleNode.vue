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
  import type { GraphNodeProps } from '@vue-flow/core';
  import { store } from '../helpers/store';
  
  // Props passed from parent
  const props = defineProps<{
    props: GraphNodeProps & { data: { moduleData: any } };
    activeHover: boolean;
    highlightedNodes: Set<string>;
  }>();
  const emit = defineEmits<{
    (e: 'hover', id: string): void;
    (e: 'leave'): void;
  }>();
  
  // Destructure values
  const id = props.props.id;
  const moduleData = props.props.data.moduleData;
  
  // Computed: check if this module is part of the plan
  const isPlanned = computed(() =>
    (store.getters.allPlannedModuleIds as string[]).includes(id)
  );
  
  // Emit hover events for tooltip & highlighting
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
  
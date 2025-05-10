<template>
  <div ref="wrapperRef" class="flex wrapper" @mouseleave="onWrapperLeave">
    <VueFlow
      ref="vueFlowRef"
      :nodes="nodes"
      :edges="edges"
      :default-zoom="0.5"
      :max-zoom="1"
      :min-zoom="0.15"
      :nodes-draggable="false"
      @edge-click="onEdgeClick"
      @nodes-initialized="fitView"
    >
      <EdgeDefs :edges="edges" />

      <template #node-module="props">
        <ModuleNode :props="props" />
      </template>
    </VueFlow>

    <FitViewButton @click="fitView" />

    <GraphTooltip v-model:visible="tooltipVisible" :x="tooltipX" :y="tooltipY">
      Diese Abhängigkeit ist Pflicht.
    </GraphTooltip>
  </div>
</template>

<script setup lang="ts">
import { useGraphView } from '../composables/useGraphView';
import { VueFlow } from '@vue-flow/core';
import EdgeDefs from '../components/GraphEdgeDefs.vue';
import ModuleNode from '../components/GraphModuleNode.vue';
import FitViewButton from '../components/GraphFitViewButton.vue';
import GraphTooltip from '../components/GraphTooltip.vue';

const {
  wrapperRef,
  vueFlowRef,
  nodes,
  edges,
  tooltipVisible,
  tooltipX,
  tooltipY,
  onEdgeClick,
  onWrapperLeave,
  fitView,
} = useGraphView();
</script>

<style scoped>
.wrapper {
  position: relative;
  width: 100%;
}

.controls {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>

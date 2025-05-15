<template>
  <div
    ref="wrapperRef"
    class="flex wrapper"
    @mouseleave="onWrapperLeave"
  >
    <VueFlow
      ref="vueFlowRef"
      :nodes="nodes"
      :edges="processedEdges"
      :default-zoom="0.5"
      :max-zoom="1"
      :min-zoom="0.15"
      :nodes-draggable="false"
      @edge-click="onEdgeClick"
      @nodes-initialized="fitView"
    >
      <EdgeDefs :edges="processedEdges" />

      <template #node-module="props">
        <ModuleNode
          :props="props"
          :active-hover="!!activeHover"
          :highlighted-nodes="highlightedNodes"
          @hover="() => onNodeHover(props.id)"
          @leave="onNodeLeave"
        />
      </template>
    </VueFlow>

    <FitViewButton @click="fitView" />

    <GraphTooltip
      v-model:visible="tooltipVisible"
      :x="tooltipX"
      :y="tooltipY"
    >
      Diese Abhängigkeit ist Pflicht.
    </GraphTooltip>
  </div>
</template>

<script setup lang="ts">
import { useGraphView } from '../composables/useGraphView';
import { useGraphHighlighting } from '../composables/useGraphHighlighting';
import { VueFlow } from '@vue-flow/core';
import EdgeDefs from '../components/GraphEdgeDefs.vue';
import ModuleNode from '../components/GraphModuleHightlight.vue';
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

const {
  activeHover,
  highlightedNodes,
  processedEdges,
  onNodeHover,
  onNodeLeave,
} = useGraphHighlighting(nodes, edges);

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

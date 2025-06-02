<template>
  <HeadlessUIDialog
    :open="open"
    class="relative z-100"
    @close="$emit('close')"
  >
    <div class="fixed inset-0 flex w-screen items-center justify-center bg-black/30 dark:bg-black/70">
      <DialogPanel
        class="w-full max-w-screen-xl max-h-dvh flex flex-col
          rounded bg-white dark:bg-zinc-900 shadow-2xl overflow-y-auto h-[100vh] sm:h-[90vh]"
      >
        <div
          ref="wrapperRef"
          class="flex relative w-full grow"
          @mouseleave="onWrapperLeave"
        >
          <VueFlow
            ref="vueFlowRef"
            data-cy="graph-vueflow"
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

          <div class="absolute right-4 top-4 opacity-60 hover:opacity-90">
            <button
              class="flex items-center"
              data-cy="graph-close-button"
              @click="$emit('close')"
            >
              <font-awesome-icon
                :icon="['fa', 'circle-xmark']"
                class="fa-2x"
              />
            </button>
          </div>

          <FitViewButton
            class="absolute right-4 bottom-4"
            @click="fitView"
          />

          <GraphTooltip
            v-model:visible="tooltipVisible"
            :x="tooltipX"
            :y="tooltipY"
          >
            Diese Abhängigkeit ist Pflicht.
          </GraphTooltip>
        </div>
      </DialogPanel>
    </div>
  </HeadlessUIDialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { VueFlow } from '@vue-flow/core';
import { Dialog as HeadlessUIDialog, DialogPanel } from '@headlessui/vue';

import EdgeDefs from '../components/GraphEdgeDefs.vue';
import ModuleNode from '../components/GraphModuleHightlight.vue';
import FitViewButton from '../components/GraphFitViewButton.vue';
import GraphTooltip from '../components/GraphTooltip.vue';

import { useGraphView } from '../composables/useGraphView';
import { useGraphHighlighting } from '../composables/useGraphHighlighting';

export default defineComponent({
  name: 'GraphDialog',
  components: {
    VueFlow,
    HeadlessUIDialog,
    DialogPanel,
    EdgeDefs,
    ModuleNode,
    FitViewButton,
    GraphTooltip,
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close'],
  setup() {
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

    return {
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
      activeHover,
      highlightedNodes,
      processedEdges,
      onNodeHover,
      onNodeLeave,
    };
  },
});
</script>

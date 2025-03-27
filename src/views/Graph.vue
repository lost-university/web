<template>
  <div class="flex flex-row wrapper">
    <VueFlow :nodes="laidOutNodes" :edges="laidOutEdges" :defaultZoom="0.5" :max-zoom="1" :min-zoom="0.15">
      <!-- Dynamically generate gradients for each edge -->
      <svg width="0" height="0">
        <defs>
          <linearGradient
            v-for="edge in laidOutEdges"
            :key="edge.id"
            :id="edge.gradientId"
            x1="0%" y1="0%" x2="100%" y2="0%"
          >
            <stop offset="0%" :stop-color="edge.sourceColor" />
            <stop offset="100%" :stop-color="edge.targetColor" />
          </linearGradient>
          <marker
            v-for="edge in laidOutEdges"
            :key="'marker_' + edge.id"
            :id="'marker_' + edge.id"
            markerWidth="10"
            markerHeight="10"
            refX="-10" 
            refY="5"
            orient="auto"
          >
            <path d="M0,0 L0,10 L10,5 Z" :fill="edge.targetColor" />
          </marker>
        </defs>
      </svg>

      <!-- Render nodes of type "module" using ModuleComponent -->
      <template #node-module="props">
        <ModuleComponent :id="props.id" :module="props.data.moduleData" />
      </template>
    </VueFlow>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MarkerType, VueFlow } from '@vue-flow/core';
import ModuleComponent from '../components/Module.vue';
import { mapGetters } from 'vuex';
import type { Module } from '../helpers/types';
import { store } from '../helpers/store';
import dagre from 'dagre';
import { getColorHexForPrioritizedCategory } from '../helpers/color-helper';

export default defineComponent({
  name: 'Graph',
  components: {
    ModuleComponent,
    VueFlow,
  },
  data() {
    return {
      laidOutNodes: [] as any[],
      laidOutEdges: [] as any[],
    };
  },
  computed: {
    ...mapGetters(['modules']),
  },
  methods: {
    // Use the hex color from the color helper so that the edge matches the module.
    getModuleColor(module: Module): string {
      return getColorHexForPrioritizedCategory(module.categoriesForColoring);
    },

    computeLayout() {
      const modulesArray = this.modules as Module[];

      // Create raw nodes for each module with temporary positions.
      let rawNodes = modulesArray.map((module, index) => ({
        id: module.id,
        type: 'module', // Must match the slot name (#node-module)
        position: { x: index * 400, y: 0 },
        data: { moduleData: module },
      }));

      // Create raw edges for each dependency.
      const rawEdges: any[] = [];
      modulesArray.forEach((module) => {
        if (module.dependentModuleIds && module.dependentModuleIds.length > 0) {
          module.dependentModuleIds.forEach((depId: string) => {
            const targetModule = modulesArray.find(m => m.id === depId);
            const sourceColor = this.getModuleColor(module);
            const targetColor = targetModule ? this.getModuleColor(targetModule) : 'gray';
            const gradientId = `edgeGradient_${module.id}_${depId}`;
            rawEdges.push({
              id: `${module.id}->${depId}`,
              source: module.id,
              target: depId,
              markerEnd: { type: MarkerType.ArrowClosed, color: targetColor },
              style: { strokeWidth: 4, stroke: `url(#${gradientId})` },
              gradientId,
              sourceColor,
              targetColor,
            });
          });
        }
      });

      // Filter out nodes that do not appear in any edge.
      const involvedNodeIds = new Set<string>();
      rawEdges.forEach(edge => {
        involvedNodeIds.add(edge.source);
        involvedNodeIds.add(edge.target);
      });
      rawNodes = rawNodes.filter(node => involvedNodeIds.has(node.id));

      // Create a dagre graph for layout.
      const g = new dagre.graphlib.Graph();
      g.setGraph({ rankdir: 'LR', marginx: 50, marginy: 50 });
      g.setDefaultEdgeLabel(() => ({}));

      // Set each node in dagre with fixed width and height.
      rawNodes.forEach((node) => {
        g.setNode(node.id, { width: 320, height: 80 });
      });
      // Add edges to the dagre graph.
      rawEdges.forEach((edge) => {
        g.setEdge(edge.source, edge.target);
      });

      // Compute layout using dagre.
      dagre.layout(g);

      // Update each node's position based on dagre's computed layout.
      rawNodes.forEach((node) => {
        const nodeWithLayout = g.node(node.id);
        node.position = {
          x: nodeWithLayout.x - nodeWithLayout.width / 2,
          y: nodeWithLayout.y - nodeWithLayout.height / 2,
        };
      });

      // Update reactive properties.
      this.laidOutNodes = rawNodes;
      this.laidOutEdges = rawEdges;
    },
  },
  mounted() {
    // Dispatch loadModules so that modules are available in the Vuex store.
    store.dispatch('loadModules').then(() => {
      console.log("Modules loaded:", this.modules);
      this.computeLayout();
    });
  },
  watch: {
    // Recompute layout if the modules array changes.
    modules(newModules: Module[]) {
      if (newModules.length > 0) {
        this.computeLayout();
      }
    },
  },
});
</script>

<style scoped>
.wrapper {
  width: 100%;
  height: 900px;
}
.wrapper > * {
  border: 1px solid #000;
  width: 100%;
}
</style>

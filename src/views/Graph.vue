<template>
  <div class="toggle-container" style="margin-bottom: 1rem;">
    <label>
      <input type="checkbox" v-model="showAllModules" />
        Alle Module anzeigen
    </label>
  </div>
  <!----<SwitchGroup>
    <div class="flex ml-auto items-start">
      <SwitchLabel class="mr-4">
        Alle Module anzeigen
      </SwitchLabel>
      <HeadlessSwitch
        :model-value="showAllModules"
        :class="showAllModules ? 'bg-teal-700' : 'bg-gray-500'"
        class="relative inline-flex h-9 w-16 sm:h-6 sm:w-11 items-center rounded-full"
        @update:model-value="showAllModulesActivate"
      >
        <span
          aria-hidden="true"
          :class="showAllModules ? 'translate-x-9 sm:translate-x-6' : 'translate-x-1'"
          class="inline-block h-6 w-6 sm:h-4 sm:w-4 transform rounded-full bg-white transition"
        />
      </HeadlessSwitch>
    </div>
  </SwitchGroup>-->

  <div class="flex flex-row wrapper">
    <VueFlow
      ref="vueFlow"
      :nodes="laidOutNodes"
      :edges="processedEdges"
      :defaultZoom="0.5"
      :max-zoom="1"
      :min-zoom="0.15"
    >


      <svg style="position: absolute; width: 0; height: 0;">
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
            id="test_marker"
            markerWidth="10"
            markerHeight="100"
            refX="0" 
            refY="5"
            orient="auto"
          >
            <path d="M0,0 L0,10 L10,5 Z" />
          </marker>
        </defs>
      </svg>

      <template #node-module="props">
        <div
          class="node-wrapper"
          :class="{ dimmed: hoveredModule && !highlightedNodes.has(props.id) }"
          @mouseover="hoveredModule = props.id"
          @mouseleave="hoveredModule = null"
        >
          <ModuleComponent :id="props.id" :module="props.data.moduleData" />
        </div>
      </template>
    </VueFlow>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue';
import { MarkerType, VueFlow } from '@vue-flow/core';
import ModuleComponent from '../components/Module.vue';
import { mapGetters } from 'vuex';
import type { AccreditedModule, Module } from '../helpers/types';
import { store } from '../helpers/store';
import { StorageHelper } from '../helpers/storage-helper';
import ELK from 'elkjs/lib/elk.bundled.js';
import { getColorHexForPrioritizedCategory } from '../helpers/color-helper';
import { Switch as HeadlessSwitch, SwitchGroup, SwitchLabel } from '@headlessui/vue'


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
      hoveredModule: null as string | null,
      showAllModules: false,
    };
  },
  computed: {
    ...mapGetters([
      'modules',
      'enrichedFocuses',
      'enrichedSemesters',
      'startSemester',
      'studienordnung',
      'allPlannedModuleIds'
    ]),
    highlightedNodes(): Set<string> {
      const highlight = new Set<string>();
      if (!this.hoveredModule) return highlight;
      highlight.add(this.hoveredModule);
      this.laidOutEdges.forEach((edge: any) => {
        if (edge.source === this.hoveredModule) {
          highlight.add(edge.target);
        }
        if (edge.target === this.hoveredModule) {
          highlight.add(edge.source);
        }
      });
      return highlight;
    },
    processedEdges(): any[] {
      if (!this.hoveredModule) return this.laidOutEdges;
      return this.laidOutEdges.map((edge: any) => {
        const isHighlighted =
          edge.source === this.hoveredModule || edge.target === this.hoveredModule;
        const baseStyle = edge.style || {};
        const dimmedStyle = !isHighlighted
          ? { opacity: 0.1, filter: 'grayscale(100%)', transition: 'opacity 0.3s ease, filter 0.3s ease' }
          : { opacity: 1, filter: 'none', transition: 'opacity 0.3s ease, filter 0.3s ease' };
        return {
          ...edge,
          style: {
            ...baseStyle,
            ...dimmedStyle,
          },
        };
      });
    },
  },
  methods: {
    showAllModulesActivate() {
      this.showAllModules = !this.showAllModules;
    },
    getPlanDataFromUrl() {
      // This method is the same as in Home.vue - TODO: Refactor to avoid duplication
      const [
        semesters,
        accreditedModules,
        startSemester,
        validationEnabled
      ] = StorageHelper.getDataFromUrlHash(
        window.location.hash,
        (semesterNumber: number, moduleId: string) => this.showUnknownModulesError(semesterNumber, moduleId)
      );
      store.commit('setValidationEnabled', validationEnabled);
      store.commit('setSemesters', semesters);
      store.commit('setAccreditedModules', accreditedModules);
      this.computeLayout();
      //store.dispatch('setStartSemester', startSemester).then(() => this.updateUrlFragment());
    },
    getModuleColor(module: Module): string {
      return getColorHexForPrioritizedCategory(module.categoriesForColoring);
    },
    fitView(){
      (this.$refs.vueFlow as any)?.fitView();
    },
    handleKeydown(event: KeyboardEvent) {
      if (event.key === 'f' || event.key === 'F') {
        this.fitView();
      }
    },
    computeLayout() {
      const allModulesArray = this.modules as Module[];
      const modulesArray = allModulesArray.filter((module) => {
        return this.showAllModules || this.allPlannedModuleIds.includes(module.id) ;
      });

      //const modulesArray = this.modules as Module[];
      console.log('Modules1:', this.allPlannedModuleIds);
      console.log('Modules:', modulesArray.map((m) => m.id));


      let rawNodes = modulesArray.map((module, index) => ({
        id: module.id,
        type: 'module',
        position: { x: index * 400, y: 0 },
        data: { moduleData: module },
      }));

      const rawEdges: any[] = [];
      modulesArray.forEach((module) => {
        if (module.dependentModuleIds && module.dependentModuleIds.length > 0) {
          module.dependentModuleIds.forEach((depId: string) => {
            if (! this.showAllModules && (!this.allPlannedModuleIds.includes(depId))) {
              return;
            }
            const targetModule = modulesArray.find((m) => m.id === depId);
            if(!targetModule) {
              return;
            }
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

      const involvedNodeIds = new Set<string>();
      rawEdges.forEach((edge) => {
        involvedNodeIds.add(edge.source);
        involvedNodeIds.add(edge.target);
      });
      //rawNodes = rawNodes.filter((node) => involvedNodeIds.has(node.id));

      const elkGraph = {
        id: 'root',
        layoutOptions: {
          'elk.algorithm': 'layered',
          'elk.direction': 'RIGHT',
          'elk.spacing.nodeNode': '50',
          'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
        },
        children: rawNodes.map((node) => ({
          id: node.id,
          width: 320,
          height: 120,
        })),
        edges: rawEdges.map((edge) => ({
          id: edge.id,
          sources: [edge.source],
          targets: [edge.target],
        })),
      };

      const elk = new ELK();

      elk
        .layout(elkGraph)
        .then((layout: any) => {
          const nodePositions: Record<string, { x: number; y: number }> = {};
          layout.children.forEach((node: any) => {
            nodePositions[node.id] = { x: node.x, y: node.y + Math.random()};
            //The random part is a workaround to avoid horizontal edges (gradient breaks than)
          });

          rawNodes.forEach((node: any) => {
            const pos = nodePositions[node.id];
            if (pos) {
              node.position = pos;
            }
          });

          this.laidOutNodes = rawNodes;
          this.laidOutEdges = rawEdges;

          
        })
        .then(() => {
          nextTick(() => {
            this.fitView();
          });
        })
        .catch((error: any) => {
          console.error('ELK layout error:', error);
        });
    },
  },
  mounted() {
    store.dispatch('loadModules').then(() => {
      this.getPlanDataFromUrl();
      this.computeLayout();
    });
    window.addEventListener('keydown', this.handleKeydown);
  },
  unmounted() {
    window.removeEventListener('keydown', this.handleKeydown);
  },
  watch: {
    $route: {
      handler() {
        setTimeout(() => {
          this.getPlanDataFromUrl();
        }, 0);
      },
    },
    modules(newModules: Module[]) {
      if (newModules.length > 0) {
        this.computeLayout();
      }
    },

    showAllModules(newVal: boolean) {
      this.computeLayout();
    },
  },
});
</script>

<style scoped>
.wrapper {
  width: 100%;
  height: 70vh;
}
.wrapper > * {
  width: 100%;
}

.node-wrapper {
  transition: filter 0.3s ease, opacity 0.3s ease;
}

.dimmed {
  filter: grayscale(100%);
  opacity: 0.1;
}
</style>

<template>
  <div class="flex flex-row wrapper" ref="wrapper" @mousemove="hideTooltip"
  >
    <VueFlow
      ref="vueFlow"
      :nodes="laidOutNodes"
      :edges="processedEdges"
      @edge-click="onEdgeClick"
      @nodes-initialized="fitView"
      :defaultZoom="0.5"
      :max-zoom="1"
      :min-zoom="0.15"
      :nodes-draggable="false"
    >
      <EdgeDefs :edges="laidOutEdges" />

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

    <button
      class="absolute right-8 bottom-4 bg-gray-800 rounded-full p-2 shadow hover:bg-gray-700 focus:outline-none fit-view-button"
      @click="fitView"
      aria-label="Fit View"
    >
      <!-- Icon: outward arrows -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 4h6M4 4v6M20 20h-6M20 20v-6" />
      </svg>
    </button>

    <div
      v-if="tooltip.visible"
      class="absolute bg-gray-800 text-white text-sm px-2 py-1 rounded shadow tooltip"
      :style="{
        top:    tooltip.y + 'px',
        left:   tooltip.x + 'px',
        zIndex: 1000,
        width:  'max-content'
      }"
    >
      Diese Abhängikeit ist Pflicht.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { VueFlow } from '@vue-flow/core';
import { mapGetters } from 'vuex';
import ModuleComponent from '../components/GraphModule.vue';
import EdgeDefs from '../components/GraphEdgeDefs.vue';
import { store } from '../helpers/store';
import { StorageHelper } from '../helpers/storage-helper';
import specialModuleIds from '../helpers/temporarySpecialModules';
import { getColorHexForPrioritizedCategory } from '../helpers/color-helper';
import {
  generateModuleNodes,
  generateModuleEdges,
  sortLayout,
} from '../helpers/graph-helper';
import type { Module } from '../helpers/types';
import type { Edge } from '@vue-flow/core';
import { nextTick } from 'vue'


export default defineComponent({
  name: 'Graph',
  components: {
    VueFlow,
    ModuleComponent,
    EdgeDefs,
  },
  data() {
    return {
      laidOutNodes: [] as any[],
      laidOutEdges: [] as any[],
      hoveredModule: null as string | null,
      showAllModules: false,
      tooltip: {
        visible: false,
        x: 20,
        y: 20,
        edgeId: '' as string,
      },
    };
  },
  computed: {
    ...mapGetters(['modules', 'allPlannedModuleIds']),
    highlightedNodes(): Set<string> {
      const highlight = new Set<string>();
      if (!this.hoveredModule) return highlight;
      highlight.add(this.hoveredModule);
      this.laidOutEdges.forEach((edge: any) => {
        if (edge.source === this.hoveredModule) highlight.add(edge.target);
        if (edge.target === this.hoveredModule) highlight.add(edge.source);
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
          ? {
              opacity: 0.1,
              filter: 'grayscale(100%)',
              transition: 'opacity 0.3s ease, filter 0.3s ease',
            }
          : { opacity: 1, filter: 'none', transition: 'opacity 0.3s ease, filter 0.3s ease' };

        let badgeBg = {};
        if (edge.labelShowBg && edge.labelBgStyle) {
          badgeBg = !isHighlighted
            ? { ...edge.labelBgStyle, fill: edge.labelBgStyle.fill + '1A' }
            : {};
        }

        let badgeText = {};
        if (edge.label && edge.labelStyle) {
          badgeText = !isHighlighted
            ? { ...edge.labelStyle, fill: edge.labelStyle.fill + '1A' }
            : {};
        }

        return {
          ...edge,
          style: { ...baseStyle, ...dimmedStyle },
          ...(edge.labelShowBg ? { labelBgStyle: { ...edge.labelBgStyle, ...badgeBg } } : {}),
          ...(edge.label ? { labelStyle: { ...edge.labelStyle, ...badgeText } } : {}),
        };
      });
    },
  },
  watch: {
    $route: {
      handler() {
        setTimeout(this.getPlanDataFromUrl, 0);
      },
    },
    modules(newModules: Module[]) {
      if (newModules.length) this.computeLayout();
    },
    showAllModules() {
      this.computeLayout();
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
  methods: {
    hideTooltip() {
      this.tooltip.visible = false;
    },
    onEdgeClick({ event, edge }: { event: MouseEvent; edge: Edge }) {
      event.stopPropagation();

      // only mandatory edges have a badge label
      if (!edge.labelShowBg || !edge.label) return;

      // find the <rect rx="15"> that is your badge background
      const target = event.target as Element;
      const badgeRect = target.tagName === 'rect' && target.getAttribute('rx')
        ? target
        : target.closest('rect[rx]');

      if (!badgeRect) {
        // clicked somewhere else on the edge — ignore
        return;
      }

      // get its screen position
      const badgeBox = (badgeRect as SVGGraphicsElement).getBoundingClientRect();
      const wrapperEl = this.$refs.wrapper as HTMLElement;
      const wrapperBox = wrapperEl.getBoundingClientRect();

      // center of the badge in wrapper-local coords
      this.tooltip.x = badgeBox.left + badgeBox.width  / 2 - wrapperBox.left;
      this.tooltip.y = badgeBox.top  + badgeBox.height / 2 - wrapperBox.top;
      this.tooltip.visible  = true;
      this.tooltip.edgeId  = edge.id!;
    },
    showAllModulesActivate() {
      this.showAllModules = !this.showAllModules;
    },
    getPlanDataFromUrl() {
      const [semesters, accreditedModules, startSem, validationEnabled] =
        StorageHelper.getDataFromUrlHash(
          window.location.hash,
          (semNum: number, moduleId: string) =>
            this.showUnknownModulesError(semNum, moduleId)
        );
      store.commit('setValidationEnabled', validationEnabled);
      store.commit('setSemesters', semesters);
      store.commit('setAccreditedModules', accreditedModules);
      this.computeLayout();
    },

    getModuleColor(module: Module): string {
      return getColorHexForPrioritizedCategory(module.categoriesForColoring);
    },

    fitView() {
      (this.$refs.vueFlow as any)?.fitView();
    },

    handleKeydown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === 'f') {
        this.fitView();
      }
    },

    async computeLayout() {
      const allModules = this.modules as Module[];
      const planned = allModules.filter((m) =>
        this.allPlannedModuleIds.includes(m.id)
      );
      const rawNodes = generateModuleNodes(planned);
      const rawEdges = generateModuleEdges(
        planned,
        this.showAllModules,
        this.allPlannedModuleIds,
        this.getModuleColor,
        specialModuleIds
      );
      try {
        const { nodes, edges } = await sortLayout(rawNodes, rawEdges);
        this.laidOutNodes = nodes;
        this.laidOutEdges = edges;
      } catch (error) {
        console.error('ELK layout error:', error);
      }

    },
  },
});
</script>

<style scoped>
.wrapper {
  position: relative;
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

.tooltip {
  position: absolute;
  background: #000;           /* black bg */
  color: #fff;                /* white text */
  padding: 0.5rem 1rem;       /* adjust px as you like */
  border-radius: 0.5rem;      /* rounded corners */
  font-size: 0.875rem;        /* e.g. text-sm */
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transform: translate(-50%, -160%); /* so x/y is the center-bottom point */
}

/* the little arrow */
.tooltip::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -6px;               /* pull it below the box */
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #000; /* same color as bg */
}

.fit-view-button {
  position: absolute;
  width: 40px;
  height: 40px;
}


</style>

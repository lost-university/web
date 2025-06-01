import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import type { VueFlow } from "@vue-flow/core";
import type { Node, Edge } from "@vue-flow/core";
import { store } from "../helpers/store";
import { getColorHexForPrioritizedCategory } from "../helpers/color-helper";
import { generateModuleEdges } from "../helpers/graph/graph-edges";
import { generateModuleNodes } from "../helpers/graph/graph-nodes";
import { sortLayout } from "../helpers/graph/graph-layout";
import { useTooltip } from "./useGraphTooltip";
import { useGraphHighlighting } from "./useGraphHighlighting";
import { getPlanDataFromUrl } from "../helpers/plan-loader";
import type { Module } from "../helpers/types";

export function useGraphView() {
  const wrapperRef = ref<HTMLElement | null>(null);
  const vueFlowRef = ref<InstanceType<typeof VueFlow> | null>(null);

  const laidOutNodes = ref<Node[]>([]);
  const laidOutEdges = ref<Edge[]>([]);

  const modules = computed<Module[]>(() => store.getters.modules as Module[]);
  const allPlannedModuleIds = computed<string[]>(
    () => store.getters.allPlannedModuleIds as string[]
  );

  const { tooltip, showTooltip, hideTooltip } = useTooltip();
  const { hoveredId, processedEdges } = useGraphHighlighting(laidOutNodes, laidOutEdges);

  const route = useRoute();

  function getModuleColor(module: Module): string {
    return getColorHexForPrioritizedCategory(module.categoriesForColoring);
  }

  function onEdgeClick({ event, edge }: { event: MouseEvent | TouchEvent; edge: Edge }) {
    event.stopPropagation();
    if (!edge.label) return;

    const wrapperEl = wrapperRef.value!;
    showTooltip(event, wrapperEl, edge.id!);
  }

  function onWrapperLeave() {
    hoveredId.value = null;
    hideTooltip();
  }

  function fitView() {
    vueFlowRef.value?.fitView();
  }

  async function computeLayout() {
    const plannedModules = modules.value.filter((m) => allPlannedModuleIds.value.includes(m.id));
    const rawNodes = generateModuleNodes(plannedModules);
    const rawEdges = generateModuleEdges(
      plannedModules,
      true,
      allPlannedModuleIds.value,
      getModuleColor
    );
    try {
      const { nodes, edges } = await sortLayout(rawNodes, rawEdges);
      laidOutNodes.value = nodes;
      laidOutEdges.value = edges;
    } catch (err) {
      console.error("ELK layout error:", err);
    }
  }

  function loadPlanDataFromUrl() {
    getPlanDataFromUrl();
    computeLayout();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key.toLowerCase() === "f") fitView();
  }

  function setGraphHeight() {
    const wrapper = wrapperRef.value;
    if (!wrapper) return;
    const { top } = wrapper.getBoundingClientRect();
    wrapper.style.height = `${window.innerHeight - top}px`;
  }

  onMounted(() => {
    store.dispatch("loadModules").then(loadPlanDataFromUrl);
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("resize", setGraphHeight);
    setGraphHeight();
  });

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("resize", setGraphHeight);
  });

  watch([modules, allPlannedModuleIds], ([mods, ids]) => {
    if (mods.length && ids.length) computeLayout();
  });
  watch(() => route.hash, loadPlanDataFromUrl);

  return {
    wrapperRef,
    vueFlowRef,
    nodes: laidOutNodes,
    edges: processedEdges,
    tooltipVisible: computed(() => tooltip.value.visible),
    tooltipX: computed(() => tooltip.value.x),
    tooltipY: computed(() => tooltip.value.y),
    onEdgeClick,
    onWrapperLeave,
    fitView,
  };
}

import { computed, ref } from 'vue';
import type { Ref } from 'vue';
import type { Edge, Node } from '@vue-flow/core';
import type { GraphEdge } from '../helpers/graph/graph-edges'


export function useGraphHighlighting(
  nodes: Ref<Node[]>,
  edges: Ref<Edge[]>
) {
  const hoveredId = ref<string | null>(null);

  const onNodeHover = (id: string) => {
    hoveredId.value = id
  }
  const onNodeLeave = () => {
    hoveredId.value = null
  }

  const activeHover = computed(() => {
    const id = hoveredId.value;
    return id && nodes.value.some((n) => n.id === id) ? id : null;
  });

  const highlightedNodes = computed((): Set<string> => {
    const set = new Set<string>();
    const hov = activeHover.value;
    if (!hov) return set;
    set.add(hov);
    edges.value.forEach((edge) => {
      if (edge.source === hov) set.add(edge.target);
      if (edge.target === hov) set.add(edge.source);
    });
    return set;
  });

  const processedEdges = computed<GraphEdge[]>(() => {
    const hov = activeHover.value;
    if (!hov) {
      return edges.value;
    }
    return edges.value.map((edge) => {
      const isHighlighted = edge.source === hov || edge.target === hov;
      const baseStyle = edge.style || {};
      const dimmedStyle = !isHighlighted
        ? { opacity: 0.1, filter: 'grayscale(100%)', transition: 'opacity 0.3s ease, filter 0.3s ease' }
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

      return ({
        ...edge ,
        style: { ...baseStyle, ...dimmedStyle },
        ...(edge.labelShowBg ? { labelBgStyle: { ...edge.labelBgStyle, ...badgeBg } } : {}),
        ...(edge.label ? { labelStyle: { ...edge.labelStyle, ...badgeText } } : {}),
      }) as GraphEdge;
    });
  });

  return {
    hoveredId,
    activeHover,
    highlightedNodes,
    processedEdges,
    onNodeHover,
    onNodeLeave,
  };
}

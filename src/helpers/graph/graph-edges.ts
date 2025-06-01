import type { Edge } from "@vue-flow/core";
import { MarkerType } from "@vue-flow/core";
import type { Module } from "../types";
import type { GraphEdge } from "../types/Graph";

function generateGraphEdges(edge: Edge, sourceColor: string, targetColor: string): GraphEdge {
  const gradientId = `edgeGradient_${edge.source}_${edge.target}`;

  return {
    ...edge,
    gradientId,
    sourceColor,
    targetColor,
  } as GraphEdge;
}

function manditoryEdgeStyle(edge: GraphEdge, _sourceColor: string, targetColor: string): GraphEdge {
  const midColor = targetColor;

  edge.style = { ...edge.style, strokeWidth: 4 };
  edge.label = "!";
  edge.labelShowBg = true;
  edge.labelBgStyle = {
    fill: midColor,
    width: "30px",
    height: "30px",
    transform: "translate(-6px,2px)",
    // Firefox was not happy about width: 30, but the type must be a number - so thiw is a workaround
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
  edge.labelBgBorderRadius = 15;
  edge.labelBgPadding = [6, 6];
  edge.labelStyle = {
    fill: "#fff",
    fontWeight: "bold",
    fontSize: "20px",
    lineHeight: "14px",
  };
  return edge;
}

function generateModuleEdges(
  modules: Module[],
  showAll: boolean,
  plannedIds: string[],
  getColor: (m: Module) => string
): GraphEdge[] {
  const edges: GraphEdge[] = [];

  modules.forEach((module) => {
    module.dependentModuleIds?.forEach((depId) => {
      if (!showAll && !plannedIds.includes(depId)) return;
      const targetModule = modules.find((m) => m.id === depId);
      if (!targetModule) return;

      const sourceColor = getColor(module);
      const targetColor = getColor(targetModule);
      const gradientId = `edgeGradient_${module.id}_${depId}`;

      let edge: GraphEdge = {
        id: `${module.id}->${depId}`,
        source: module.id,
        target: depId,
        markerEnd: { type: MarkerType.ArrowClosed, color: targetColor },
        style: { strokeWidth: 4, stroke: `url(#${gradientId})` },
        gradientId,
        sourceColor,
        targetColor,
      } as GraphEdge;

      if (module.isMandatory && targetModule.isMandatory) {
        edge = manditoryEdgeStyle(edge, sourceColor, targetColor);
      }

      edges.push(edge);
    });
  });

  return edges;
}

export { generateGraphEdges, manditoryEdgeStyle, generateModuleEdges };

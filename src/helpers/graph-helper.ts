import ELK from 'elkjs/lib/elk.bundled.js';
import type { Node, Edge, XYPosition } from '@vue-flow/core';
import { MarkerType } from '@vue-flow/core';
import type { Module } from './types';

export type GraphNode = Node<{ moduleData: Module }>;

export type GraphEdge = Edge & {
  gradientId: string;
  sourceColor: string;
  targetColor: string;
  label?: string;
  labelShowBg?: boolean;
  labelBgStyle?: {
    fill: string;
    width: number;
    height: number;
    rx: number;
    ry: number;
    transform: string;
  };
  labelBgPadding?: [number, number];
  labelStyle?: {
    fill: string;
    fontWeight: string;
    fontSize: string;
    lineHeight: string;
  };
};


export function generateModuleNodes(modules: Module[]): GraphNode[] {
  return modules.map((module, idx) => ({
    id: module.id,
    type: 'module',
    position: { x: idx * 400, y: 0 } as XYPosition,
    data: { moduleData: module },
  }));
}


export function manditoryEdgeStyle(
  edge: GraphEdge,
  sourceColor: string,
  targetColor: string
): GraphEdge {
  const midColor = targetColor;

  edge.style = { ...edge.style, strokeWidth: 4 };
  edge.label = '!';
  edge.labelShowBg = true;
  edge.labelBgStyle = {
    fill: midColor,
    width: 30,
    height: 30,
    rx: 15,
    ry: 15,
    transform: 'translate(-6px,2px)',
  };
  edge.labelBgPadding = [6, 6];
  edge.labelStyle = {
    fill: '#fff',
    fontWeight: 'bold',
    fontSize: '20px',
    lineHeight: '14px',
  };
  return edge;
}


export function generateModuleEdges(
  modules: Module[],
  showAll: boolean,
  plannedIds: string[],
  getColor: (m: Module) => string,
  specialIds: Set<string>
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

      if (specialIds.has(module.id) && specialIds.has(depId)) {
        edge = manditoryEdgeStyle(edge, sourceColor, targetColor);
      }

      edges.push(edge);
    });
  });

  return edges;
}

export async function sortLayout(
  nodes: GraphNode[],
  edges: GraphEdge[]
): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
  const elk = new ELK();
  const elkGraph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',
      'elk.spacing.nodeNode': '50',
      'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
    },
    children: nodes.map((node) => ({ id: node.id, width: 320, height: 120 })),
    edges: edges.map((edge) => ({ id: edge.id, sources: [edge.source], targets: [edge.target] })),
  };

  const layout = await elk.layout(elkGraph);

  const nodePositions: Record<string, { x: number; y: number }> = {};
  layout.children?.forEach((child: any) => {
    nodePositions[child.id] = { x: child.x, y: child.y + Math.random() };
  });

  const positionedNodes = nodes.map((node) => {
    const pos = nodePositions[node.id];
    return pos ? { ...node, position: pos } : node;
  });

  return { nodes: positionedNodes, edges };
}

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

const elk = new ELK();


const savedPositions: Record<string, { x: number; y: number }> = {};

export interface LayoutResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
}


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
  rawNodes: GraphNode[],
  rawEdges: GraphEdge[],
): Promise<LayoutResult> {
  const currentIds = rawNodes.map(n => n.id);
  const cachedIds = Object.keys(savedPositions);

  const newNodeIds = currentIds.filter(id => !cachedIds.includes(id));
  const removedNodeIds = cachedIds.filter(id => !currentIds.includes(id));
  const changeCount = newNodeIds.length + removedNodeIds.length;

  // no changes
  if (changeCount === 0) {
    const nodes = rawNodes.map(n => ({
      ...n,
      position: { ...savedPositions[n.id] }
    }));
    return { nodes, edges: rawEdges };
  }

    // exactly one removal
    if (removedNodeIds.length === 1 && newNodeIds.length === 0) {
      delete savedPositions[removedNodeIds[0]];
      const nodes = rawNodes.map(n => ({
        ...n,
        position: { ...savedPositions[n.id] }
      }));
      return { nodes, edges: rawEdges };
    }
  

  // exactly one addition: place it next to its neighbors
  if (newNodeIds.length < 3 && removedNodeIds.length === 0) {
    const addedId = newNodeIds[0];

    // find all neighbors of the new node
    const neighborIds = rawEdges
      .filter(e => e.source === addedId || e.target === addedId)
      .map(e => (e.source === addedId ? e.target : e.source))
      // only keep those we actually have cached positions for
      .filter(id => id in savedPositions);

    let newPos: { x: number; y: number };

    if (neighborIds.length > 0) {
      // average the neighbor positions
      const sum = neighborIds.reduce(
        (acc, id) => {
          const p = savedPositions[id];
          return { x: acc.x + p.x, y: acc.y + p.y };
        },
        { x: 0, y: 0 }
      );
      const avgX = sum.x / neighborIds.length;
      const avgY = sum.y / neighborIds.length;

      // offset just to the right (you can tweak the offset as you like)
      newPos = { x: avgX + 200, y: avgY };
    } else {
      // fallback to the far right if it has no links
      const maxX = Math.max(
        ...Object.values(savedPositions).map(p => p.x),
        0
      );
      newPos = { x: maxX + 400, y: 0 };
    }

    // cache and return all positions
    savedPositions[addedId] = newPos;
    const nodes = rawNodes.map(n => ({
      ...n,
      position: { ...savedPositions[n.id] }
    }));
    return { nodes, edges: rawEdges };
  }


  // >1 change → full ELK re-layout
  const elkGraph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',
      'elk.layered.crossingMinimization': 'LAYER_SWEEP',
      'elk.randomize': 'false',
      'elk.spacing.nodeNode': '50',
      'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
    },
    children: rawNodes.map(n => ({
      id: n.id,
      width: 320,
      height: 100,
    })),
    edges: rawEdges.map(e => ({
      id: e.id!,
      sources: [e.source],
      targets: [e.target],
    })),
  };

  const elkResult = await elk.layout(elkGraph);

  const laidOut = elkResult.children!.map(elkNode => {
    const orig = rawNodes.find(n => n.id === elkNode.id)!;
    return {
      ...orig,
      position: {
        x: elkNode.x! + Math.random(),
        y: elkNode.y! + Math.random(),
      }
    };
  });

  // update the cache in full
  laidOut.forEach(n => {
    savedPositions[n.id] = { x: n.position.x, y: n.position.y };
  });

  return { nodes: laidOut, edges: rawEdges };
}

import type { GraphNode } from './graph-nodes';
import type { GraphEdge } from './graph-edges';


export interface LayoutResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function isIsolated(id: string, edges: GraphEdge[]): boolean {
  return !edges.some((e) => e.source === id || e.target === id);
}

function buildAdjacency(edges: GraphEdge[]): Map<string, Set<string>> {
  const adj = new Map<string, Set<string>>();
  edges.forEach((e) => {
    if (!adj.has(e.source)) adj.set(e.source, new Set());
    if (!adj.has(e.target)) adj.set(e.target, new Set());
    (adj.get(e.source) as Set<string>).add(e.target);
    (adj.get(e.target) as Set<string>).add(e.source);
  });
  return adj;
}

export function components(nodes: GraphNode[], edges: GraphEdge[]): string[][] {
  const adj = buildAdjacency(edges);
  const seen = new Set<string>();
  const comps: string[][] = [];

  for (const n of nodes) {
    if (seen.has(n.id)) continue;
    const stack = [n.id];
    const comp: string[] = [];
    seen.add(n.id);
    while (stack.length) {
      const cur = stack.pop()!;
      comp.push(cur);
      for (const neigh of adj.get(cur) ?? []) {
        if (!seen.has(neigh)) {
          seen.add(neigh);
          stack.push(neigh);
        }
      }
    }
    comps.push(comp);
  }
  return comps;
}

import type { Module } from "../helpers/types";
import type { Node, Edge } from "@vue-flow/core";

export type GraphNode = Node<{ moduleData: Module }>;

export interface LayoutResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export type GraphEdge = Edge & {
  gradientId: string;
  sourceColor: string;
  targetColor: string;
};

import type { Edge } from '@vue-flow/core';
import type { Module } from '../types';
import type { Edge as VueFlowEdge } from '@vue-flow/core';

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

export type GraphNode = Node<{ moduleData: Module }>;

export interface LayoutResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export type GraphEdge = VueFlowEdge & {
gradientId: string;
sourceColor: string;
targetColor: string;
};

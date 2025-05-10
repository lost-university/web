import type { Node, XYPosition } from '@vue-flow/core';
import type { Module } from '../types';


export type GraphNode = Node<{ moduleData: Module }>;

export function generateModuleNodes(modules: Module[]): GraphNode[] {
  return modules.map((module, idx) => ({
    id: module.id,
    type: 'module',
    position: { x: idx * 400, y: 0 } as XYPosition,
    data: { moduleData: module },
  }));
}
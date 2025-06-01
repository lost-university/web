import type { XYPosition } from "@vue-flow/core";
import type { Module } from "../types";
import type { GraphNode } from "../types/Graph";

export function generateModuleNodes(modules: Module[]): GraphNode[] {
  return modules.map((module, idx) => ({
    id: module.id,
    type: "module",
    position: { x: idx, y: 0 } as XYPosition,
    data: { moduleData: module },
  }));
}

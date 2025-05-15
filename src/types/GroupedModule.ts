import type { Module } from "../helpers/types";

export interface GroupedModule {
  id: string,
  name: string,
  modules: Module[],
  isOpen: boolean,
  colorClass: object
}

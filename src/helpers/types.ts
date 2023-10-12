export type Module = {
  id: string,
  name: string,
  categories: ModuleCategory[],
  ects: number,
  recommendedModuleIds: string[]
};

export type Focus = {
  id: string,
  name: string,
  modules: Module[],
};

export type Category = {
  id: string,
  name: string,
  required_ects: number,
  modules: Module[],
};

export type Semester = {
  number: number,
  modules: Module[],
};

export type UnknownModule = {
  id: string,
  semesterNumber: number,
};

type ModuleCategory = {
  id: string,
  name: string,
  ects: number,
};

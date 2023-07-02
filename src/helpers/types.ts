export type Module = {
  id: string,
  name: string,
  url: string,

  isThesis: boolean,
  isRequired: boolean,
  recommendedSemester: number,
  focuses: ModuleFocus[],
  categories: ModuleCategory[],
  ects: number,
};

export type Focus = {
  id: string,
  name: string,
  url: string,
  modules: Module[],
};

export type Category = {
  id: string,
  name: string,
  required_ects: number,
  total_ects: number,
  modules: Module[],
};

export type Semester = {
  number: number,
  modules: Module[],
};

export type UnknownModule = {
  moduleId: string, semesterNumber: number,
};

type ModuleFocus = {
  id: string,
  name: string,
  url: string,
};

type ModuleCategory = {
  id: string,
  name: string,
  ects: number,
};

import type {SemesterInfo} from "./semester";

export type Module = {
  id: string,
  name: string,
  url: string,
  categories: ModuleCategory[],
  ects: number,
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
  info: SemesterInfo | undefined,
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

export type Contributor = {
  name: string,
  githubHandle: string,
};

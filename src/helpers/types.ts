export type Module = {
  id: string,
  name: string,
  url: string,
  categories_for_coloring: string[],
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
  number: number,
  modules: Module[],
};

export type UnknownModule = {
  id: string,
  semesterNumber: number,
};

export type Contributor = {
  name: string,
  githubHandle: string,
};

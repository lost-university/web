import { SemesterInfo } from "./semester-info";

export type Term = 'FS' | 'HS';

export class Module {
  id: string;
  name: string;
  url: string;
  categoriesForColoring: string[];
  ects: number;
  term: Term;

  // undefined means there cannot be a next semester for this module (reached max semesters)
  nextPossibleSemester: SemesterInfo | undefined;

  constructor(id: string, name: string, url: string, categoriesForColoring: string[], ects: number, term: Term) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.categoriesForColoring = categoriesForColoring;
    this.ects = ects;
    this.term = term;
  }

  calculateNextPossibleSemester(startSemester: SemesterInfo): Module {
    this.nextPossibleSemester = SemesterInfo.getNextPossibleSemesterForModule(this.term, startSemester);
    return this;
  }
}

export class Focus {
  id: string;
  name: string;
  modules: Module[];

  constructor(id: string, name: string, modules: Module[]) {
    this.id = id;
    this.name = name;
    this.modules = modules;
  }
}

export class Category {
  id: string;
  name: string;
  requiredEcts: number;
  modules: Module[];

  constructor(id: string, name: string, requiredEcts: number, modules: Module[]) {
    this.id = id;
    this.name = name;
    this.requiredEcts = requiredEcts;
    this.modules = modules;
  }
}

export class Semester {
  number: number;
  name: string | undefined;
  modules: Module[];

  constructor(number: number, modules: Module[]) {
    this.number = number;
    this.modules = modules;
  }

  setName(startSemester: SemesterInfo | undefined): Semester {
    this.name = startSemester ? startSemester.plus(this.number - 1).toString() : undefined;
    return this;
  }
}

export class UnknownModule {
  id: string;
  semesterNumber: number;
}

export class Contributor {
  name: string;
  githubHandle: string;
}

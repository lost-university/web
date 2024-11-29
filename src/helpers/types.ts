import { SemesterInfo } from "./semester-info";
import { ValidationHelper, type ModuleValidationInfo } from "./validation-helper";

export type Term = 'FS' | 'HS' | 'both' | undefined;

export class Module {
  id: string;
  name: string;
  url: string;
  categoriesForColoring: string[];
  ects: number;
  isDeactivated: boolean;
  term: Term;
  successorModuleId: string | undefined;
  predecessorModuleId: string | undefined;
  recommendedModuleIds: string[];
  dependentModuleIds: string[];
  validationInfo: ModuleValidationInfo | null;

  // null means there cannot be a next semester for this module (reached max semesters)
  nextPossibleSemester: SemesterInfo | null;

  constructor(
    id: string,
    name: string,
    url: string,
    categoriesForColoring: string[],
    ects: number,
    term: Term,
    recommendedModuleIds: string[],
    dependentModuleIds: string[],
    successorModuleId: string,
    predecessorModuleId: string,
    isDeactivated: boolean
  ) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.categoriesForColoring = categoriesForColoring;
    this.ects = ects;
    this.term = term;
    this.recommendedModuleIds = recommendedModuleIds;
    this.dependentModuleIds = dependentModuleIds;
    this.successorModuleId = successorModuleId;
    this. predecessorModuleId = predecessorModuleId;
    this.isDeactivated = isDeactivated;
    this.validationInfo = null;
    this.nextPossibleSemester = null;
  }

  calculateNextPossibleSemester(startSemester: SemesterInfo) {
    this.nextPossibleSemester = SemesterInfo.getNextPossibleSemesterForTerm(this.term, startSemester);
  }

  validateModule(allSemesters: Semester[]) {
    this.validationInfo = ValidationHelper.getValidationInfoForModule(this, allSemesters);
  }
}

export class Focus {
  id: string;
  name: string;
  modules: Module[];
  moduleIds: string[]

  constructor(id: string, name: string, moduleIds: string[]) {
    this.id = id;
    this.name = name;
    this.moduleIds = moduleIds;
    this.modules = [];
  }
}

export class Category {
  id: string;
  name: string;
  requiredEcts: number;
  earnedEcts: number;
  plannedEcts: number;
  colorClass: string;
  modules: Module[];
  moduleIds: string[];

  constructor(id: string, name: string, requiredEcts: number, moduleIds: string[]) {
    this.id = id;
    this.name = name;
    this.requiredEcts = requiredEcts;
    this.earnedEcts = 0;
    this.plannedEcts = 0;
    this.colorClass = '';
    this.moduleIds = moduleIds;
    this.modules = [];
  }
}

export class Semester {
  number: number;
  name: string | undefined;
  modules: Module[];
  moduleIds: string[]

  constructor(number: number, moduleIds: string[]) {
    this.number = number;
    this.moduleIds = moduleIds;
    this.modules = [];
  }

  setName(startSemester: SemesterInfo | undefined): Semester {
    this.name = startSemester ? startSemester.plus(this.number - 1).toString() : undefined;
    return this;
  }
}

export class UnknownModule {
  id!: string;
  semesterNumber!: number;
}

export class Contributor {
  name!: string;
  githubHandle!: string;
}

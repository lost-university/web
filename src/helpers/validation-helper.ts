import type { AccreditedModule, Module, Semester } from '../helpers/types';
import { SemesterInfo } from './semester-info';
import { store } from './store';

type ModuleValidationInfo_Base = {
  text: string;
  moduleId: string;
};

export type ModuleValidationInfo_Duplicate =
  ModuleValidationInfo_Base &
  {type: 'duplicate', semesterNumbersToRemoveFrom: number[] };
export type ModuleValidationInfo_WrongTerm =
  ModuleValidationInfo_Base &
  {type: 'wrongTerm', targetSemesterNumber: number};
export type ModuleValidationInfo_Inactive =
  ModuleValidationInfo_Base &
  {type: 'inactive', successorModuleId: string | undefined};

export type ModuleValidationGlobalInfo =
  ModuleValidationInfo_Duplicate |
  ModuleValidationInfo_WrongTerm |
  ModuleValidationInfo_Inactive |
  {type: 'beforeRecommended'} |
  {type: 'duplicateAccredited'};

export type ModuleValidationInfo = {
  severity: 'soft' | 'hard', tooltip: string
} & ModuleValidationGlobalInfo;

export class ValidationHelper {
  static getValidationInfoForModule(
    module: Module,
    allSemesters: Semester[],
    allAccreditedModules: AccreditedModule[]
  ): ModuleValidationInfo | null {
    const alreadyInPlanValidationInfo = this.getValidationInfoForModuleAlreadyInPlan(module.id, allSemesters);
    if (alreadyInPlanValidationInfo) {
      return alreadyInPlanValidationInfo;
    }

    // we now know, that only one semester contains the module
    const semesterForModule = allSemesters.find(s => s.modules.some(m => m.id === module.id));
    if(!semesterForModule) {
      // module is not planned, does not need validation right now
      return null;
    }
    const semesterInfoForModule = SemesterInfo.parse(semesterForModule.name);
    if(semesterInfoForModule == null) {
      return null;
    }

    if(this.isSemesterInThePast(semesterInfoForModule)) {
      if(this.isModuleInactive(module)) {
        if(module.successorModuleId) {
          return {
            type: 'inactive',
            successorModuleId: module.successorModuleId,
            severity: 'soft',
            tooltip: `Modul hat Nachfolger ${module.successorModuleId}`,
            text: `${module.id} (${semesterForModule.name}) hat Nachfolger ${module.successorModuleId}`,
            moduleId: module.id
          };
        }
      }
      if(this.isModuleInWrongTerm(module, semesterInfoForModule)) {
        const targetSemesterNumber = semesterForModule.number + 1;
        return {
          type: 'wrongTerm',
          targetSemesterNumber,
          severity: 'soft',
          tooltip: `${module.name} findet nur im ${module.term} statt`,
          text: `${module.id} (${semesterForModule.name}) findet nur im ${module.term} statt`,
          moduleId: module.id
        };
      }
      return null;
    }

    if(this.isModuleInactive(module)) {
      return {
        type: 'inactive',
        successorModuleId: module.successorModuleId,
        severity: 'hard',
        tooltip: module.successorModuleId ? `Modul ${module.name} wird nicht mehr angeboten, hat Nachfolger ${module.successorModuleId}` : `Modul ${module.name} wird nicht mehr angeboten`,
        text: module.successorModuleId ? `${module.id} (${semesterForModule.name}) wird nicht mehr angeboten, hat Nachfolger ${module.successorModuleId}` : `${module.id} (${semesterForModule.name}) wird nicht mehr angeboten`,
        moduleId: module.id
      };
    }
    if(this.isModuleInWrongTerm(module, semesterInfoForModule)) {
      const targetSemesterNumber = semesterForModule.number + 1;
      return {
        type: 'wrongTerm',
        targetSemesterNumber,
        severity: 'hard',
        tooltip: `${module.name} findet nur im ${module.term} statt`,
        text: `${module.id} (${semesterForModule.name}) findet nur im ${module.term} statt`,
        moduleId: module.id
      };
    }
    const beforeRecommendedValidationInfo = this.getValidationInfoForModuleBeforeRecommendedModules(
      module,
      semesterForModule.number,
      allSemesters,
      allAccreditedModules
    );
    if(beforeRecommendedValidationInfo) {
      return beforeRecommendedValidationInfo;
    }

    return null;
  }

  static getValidationInfoForAccreditedModule(
    accreditedModule: AccreditedModule,
    allSemesters: Semester[],
    allAccreditedModules: AccreditedModule[]
  ): ModuleValidationInfo | null {
    if (accreditedModule.moduleId) {
      return this.getValidationInfoForModuleAlreadyInPlan(accreditedModule.moduleId, allSemesters, false);
    }
    if (allAccreditedModules.filter(m => m.name === accreditedModule.name).length <= 1) {
      return null;
    }
    return {
      type: 'duplicateAccredited',
      severity: 'hard',
      tooltip: `Übertrittsmodul ist bereits erfasst`
    };
  }

  static isModuleInWrongTerm(module: Module, semesterInfo: SemesterInfo): boolean {
    switch (module.term) {
      case 'FS':
        return !semesterInfo.isSpringSemester;
      case 'HS':
        return semesterInfo.isSpringSemester;
      case 'both':
      case '':
        return false;
      default:
        console.error(`Invalid term ${module.term} for module ${module.id}`);
        return true;
    }
  }

  private static isSemesterInThePast(semesterInfo: SemesterInfo) {
    return semesterInfo.difference(SemesterInfo.now()) < 0;
  }

  private static getValidationInfoForModuleAlreadyInPlan(
    moduleId: string,
    allSemesters: Semester[],
    moduleItselfIsAlsoInPlan: boolean = true,
  ): ModuleValidationInfo | null {
    const plannedModules = allSemesters.reduce(
      (modules, sem) =>
        [...modules, ...sem.modules.flatMap(m =>({semester: sem, module: m}))],
      [] as {module: Module, semester: Semester}[]
    );
    const predecessorOrSuccessorOccurences = plannedModules.filter(m => m.module.predecessorModuleId === moduleId || m.module.successorModuleId === moduleId);
    const occurences = plannedModules.filter(m => m.module.id === moduleId).concat(predecessorOrSuccessorOccurences);
    if(moduleItselfIsAlsoInPlan ? occurences.length <= 1 : occurences.length <= 0) {
      return null;
    }
    const semesterNumbersToRemoveFrom = occurences.map(m => m.semester.number).slice(1);
    const distinctSemesterNames = occurences.reduce(
      (distinct, occ) =>
        distinct.includes(occ.semester.name!) ? distinct : [...distinct, occ.semester.name!],
      [] as string[]
    ).join(', ');

    let tooltip = `Modul ist doppelt im Plan, in Semestern ${distinctSemesterNames}`;
    let text = `${moduleId} ist in mehreren Semestern (${distinctSemesterNames})`;
    if (predecessorOrSuccessorOccurences.length) {
      if(predecessorOrSuccessorOccurences.length === occurences.length - 1) {
        const predecessorOrSuccessorNames = predecessorOrSuccessorOccurences.map(m => m.module.name).reduce((distinct, name) => distinct.includes(name) ? distinct : [...distinct, name], [] as string[]).join(', ');
        tooltip = `Vorgänger/Nachfolger ${predecessorOrSuccessorNames} ist doppelt im Plan, in Semestern ${distinctSemesterNames}`;
        text = `Vorgänger/Nachfolger ${predecessorOrSuccessorNames} für ${moduleId} ist in mehreren Semestern (${distinctSemesterNames})`;
      } else {
        tooltip = `Modul oder ein Vorgänger/Nachfolger ist doppelt im Plan, in Semestern ${distinctSemesterNames}`;
        text = `${moduleId} oder ein Vorgänger/Nachfolger ist in mehreren Semestern (${distinctSemesterNames})`;
      }
    }

    return {
      type: 'duplicate',
      semesterNumbersToRemoveFrom,
      severity: 'hard',
      tooltip,
      text,
      moduleId
    };
  }

  private static isModuleInactive(module: Module): boolean {
    return module.isDeactivated;
  }

  private static getValidationInfoForModuleBeforeRecommendedModules(
    module: Module,
    semesterNumberForModule: number,
    allSemesters: Semester[],
    allAccreditedModules: AccreditedModule[]
  ): ModuleValidationInfo | null {
    if(module.recommendedModuleIds.length === 0) {
      return null;
    }

    const missing = [];
    const later = [];
    for (const recommendedModuleId of module.recommendedModuleIds) {
      const {position, moduleIdForPosition} = this.getPositionOfModuleInPlan(
        recommendedModuleId,
        allSemesters,
        semesterNumberForModule,
        allAccreditedModules);
      if (position === 'later') {
        later.push(moduleIdForPosition);
      } else if(position === 'missing') {
        missing.push(moduleIdForPosition);
      }
    }

    if(missing.length == 0 && later.length == 0) {
      return null;
    }

    const tooltipForMissing = missing.length ? `Nicht eingeplante, empfohlene Module: ${missing.join(', ')}` : '';
    const tooltipForLater = later.length ? `Später eingeplante, empfohelen Module: ${later.join(', ')}` : '';

    return {
      type: 'beforeRecommended',
      severity: 'soft',
      tooltip: [tooltipForMissing, tooltipForLater].filter(f => f).join('\n')
    };
  }

  private static getPositionOfModuleInPlan(
    moduleId: string,
    allSemesters: Semester[],
    referenceSemesterNumber: number,
    allAccreditedModules: AccreditedModule[]
  ): { position: 'sameOrEarlier' | 'later' | 'missing', moduleIdForPosition: string } {
    const semesterNumberForModule = this.getSemesterNumberForModuleId(moduleId, allSemesters);
    if(semesterNumberForModule) {
      if (semesterNumberForModule <= referenceSemesterNumber) {
        return { position: 'sameOrEarlier', moduleIdForPosition: moduleId};
      }
      if (semesterNumberForModule > referenceSemesterNumber) {
        return { position: 'later', moduleIdForPosition: moduleId };
      }
    }
    if(allAccreditedModules.some(m => m.moduleId === moduleId)) {
      return { position: 'sameOrEarlier', moduleIdForPosition: moduleId};
    }

    const successor = store.getters.modules.find(m => m.predecessorModuleId === moduleId);
    if(!successor) {
      return { position: 'missing', moduleIdForPosition: moduleId };
    }
    return this.getPositionOfModuleInPlan(successor.id, allSemesters, referenceSemesterNumber, allAccreditedModules);
  }


  private static getSemesterNumberForModuleId(moduleId: string, allSemesters: Semester[]): number | undefined {
    return allSemesters.find(sem => sem.moduleIds.includes(moduleId))?.number;
  }
}

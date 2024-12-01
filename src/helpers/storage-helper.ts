import { parseQuery } from "vue-router";
import { SemesterInfo } from "./semester-info";
import { AccreditedModule, Semester } from "./types";
import { store } from "./store";

export class StorageHelper {
  private static readonly LOCALSTORAGE_PLAN_KEY = 'plan';
  private static readonly URL_PLAN_KEY = 'plan';
  private static readonly URL_MODULE_SEPARATOR = '_';
  private static readonly URL_SEMESTER_SEPARATOR = '-';
  private static readonly URL_START_SEMESTER_KEY = 'startSemester';
  private static readonly URL_VALIDATION_ENABLED_KEY = 'validation';
  private static readonly URL_PLAN_INDICATOR = `#/${this.URL_PLAN_KEY}/`;

  // http://localhost:5173/#/plan/EnglHTw-AppArch_BlCh/DigiCamp.3.Inf~Auf_ExEv?startSemester=HS23

  static getDataFromUrlHash(
    urlHash: string,
    unknownModuleCallback: (semesterNumber: number, moduleId: string) => void
  ): [Semester[], AccreditedModule[], SemesterInfo | undefined, boolean] {

      if (!urlHash.startsWith(this.URL_PLAN_INDICATOR)) {
        const cachedPlan = localStorage.getItem(this.LOCALSTORAGE_PLAN_KEY);
        if (cachedPlan) {
          window.location.hash = cachedPlan;
          urlHash = cachedPlan;
        }
      }

      if (urlHash.startsWith(this.URL_PLAN_INDICATOR)) {
        const [newSemesters, accreditedModules, newStartSemester, validation] = this.getPlanDataFromUrlHash(urlHash, unknownModuleCallback);

        const hashFromNewSemesters = this.getUrlHashFromPlanData(newSemesters, accreditedModules, newStartSemester, validation);
        const newestHash = `${this.URL_PLAN_INDICATOR}${hashFromNewSemesters}`;
        if (urlHash !== newestHash) {
          window.location.hash = newestHash;
        }

        this.savePlanInLocalStorage(newestHash);

        return [newSemesters, accreditedModules, newStartSemester, validation];
      }
      return [[], [], undefined, true];
  }

  static updateUrlFragment() {
    const semesters = store.getters.semesters;
    const accreditedModules = store.getters.accreditedModules;
    const startSemester = store.getters.startSemester;
    const validationEnabled = store.getters.validationEnabled;
    const plan = this.getUrlHashFromPlanData(semesters, accreditedModules, startSemester, validationEnabled);

    window.location.hash = `/${this.URL_PLAN_KEY}/${plan}`;

    if (plan) {
      this.savePlanInLocalStorage(window.location.hash);
    }
  }

  private static getUrlHashFromPlanData(
    semesters: Semester[],
    accreditedModules: AccreditedModule[],
    startSemester: SemesterInfo | undefined,
    validationEnabled: boolean
  ): string {
    let plan = semesters
      .map((semester) => semester.moduleIds.join(this.URL_MODULE_SEPARATOR))
      .join(this.URL_SEMESTER_SEPARATOR);

    if(accreditedModules.length > 0) {
      plan = plan + '/' + accreditedModules.map(m => m.moduleId ? m.moduleId : encodeURIComponent(`${m.name}.${m.ects}.${m.categoryIds.join('~')}`)).join(this.URL_MODULE_SEPARATOR);
    }

    const query = [];
    if (startSemester !== undefined) {
      query.push(`${this.URL_START_SEMESTER_KEY}=${startSemester.toString()}`);
    }
    if(validationEnabled !== true) {
      query.push(`${this.URL_VALIDATION_ENABLED_KEY}=${validationEnabled}`);
    }
    if(query.length) {
      plan += `?${query.join('&')}`;
    }

    return plan;
  }

  private static savePlanInLocalStorage(path: string) {
    localStorage.setItem(this.LOCALSTORAGE_PLAN_KEY, path);
  }

  private static isNullOrWhitespace(input: string) {
    return !input || !input.trim();
  }

  private static getModuleIdsFromSemesterPart(
    semesterPart: string,
    unknownModuleCallback: (semesterNumber: number, moduleId: string) => void
  ): string[] {
    const moduleIds = semesterPart
      .split(this.URL_MODULE_SEPARATOR)
      .filter(moduleId => !(this.isNullOrWhitespace(moduleId)));

    // even if we cannot find a module, we might be able to find its successor, with which we will replace it
    return moduleIds.map((moduleId, index) => {
      if(!store.getters.modules.find(m => m.id === moduleId)) {
        const successorModuleId = store.getters.modules.find(m => m.predecessorModuleId === moduleId)?.id;
        if(!successorModuleId) {
          unknownModuleCallback?.(index + 1, moduleId);
          return null;
        }
        return successorModuleId;
      }
      return moduleId;
    }).filter(f => f).map(m => m!);
  }

  private static getPlanDataFromUrlHash(urlHash: string, unknownModuleCallback: (semesterNumber: number, moduleId: string) => void): [Semester[], AccreditedModule[], SemesterInfo | undefined, boolean]{
    const [ hash, query ] = urlHash.split('?');

    let newStartSemester = undefined;
    let validation = true;

    if (query != undefined) {
      const queryParameters = parseQuery(query);
      const startSemesterQueryParameter = queryParameters[this.URL_START_SEMESTER_KEY];
      const validationQueryParameter = queryParameters[this.URL_VALIDATION_ENABLED_KEY];

      if (typeof startSemesterQueryParameter === 'string') {
        newStartSemester = SemesterInfo.parse(startSemesterQueryParameter) ?? undefined;
      }
      validation = validationQueryParameter === 'false' ? false : true;
    }

    const splitHash = hash.slice(this.URL_PLAN_INDICATOR.length).split('/');

    const newSemesters = splitHash[0].split(this.URL_SEMESTER_SEPARATOR)
      .map((semesterPart, index) =>
        new Semester(
          index + 1,
          this.getModuleIdsFromSemesterPart(semesterPart, unknownModuleCallback)
        ).setName(newStartSemester)
      );
    const accreditedModules = splitHash.length > 1 ? this.getAccreditedModulesFromAccreditedHashPart(splitHash[1]) : [];

    return [newSemesters, accreditedModules, newStartSemester, validation];
  }

  private static getAccreditedModulesFromAccreditedHashPart(accreditedHashPart: string): AccreditedModule[] {
    const modulesInfo = decodeURIComponent(accreditedHashPart)
      .split(this.URL_MODULE_SEPARATOR)
      .filter(modulesInfo => !this.isNullOrWhitespace(modulesInfo))
      .map(modulesInfo => modulesInfo.split('.').filter(modulesInfo => !this.isNullOrWhitespace(modulesInfo)));

    const accreditedModules = modulesInfo.map(moduleInfo => {
      if(moduleInfo.length === 3) {
        const name = moduleInfo[0];
        const ects = moduleInfo[1];
        const categoryIds = moduleInfo[2].split(`~`).filter(categoryId => !this.isNullOrWhitespace(categoryId));
        return AccreditedModule.createFromExternalData(name, Number(ects), categoryIds);
      }
      if (moduleInfo.length === 1) {
        const module = store.getters.modules.find(m => m.id === moduleInfo[0]);
        return AccreditedModule.createFromExistingModule(module);
      }
      return null;
    });

    return accreditedModules.filter(accreditedModule => accreditedModule).map(accreditedModule => accreditedModule!);
  }


}

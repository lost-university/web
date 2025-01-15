import { createStore } from 'vuex'
import { AccreditedModule, Category, Focus, Module, Semester } from './types';
import { SemesterInfo } from './semester-info';
import { getColorClassForCategoryId } from '../helpers/color-helper';

const BASE_URL = 'https://raw.githubusercontent.com/StefanieJaeger/lost-university-data/SJ/after-sa/data';
const ROUTE_MODULES = '/modules.json';
const ROUTE_CATEGORIES = '/categories.json';
const ROUTE_FOCUSES = '/focuses.json';

export const store = createStore({
  state () {
    return {
      modules: [] as Module[],
      accreditedModules: [] as AccreditedModule[],
      categories: [] as Category[],
      semesters: [] as Semester[],
      focuses: [] as Focus[],
      startSemester: undefined as SemesterInfo | undefined,
      studienordnung: '21' as '21' | '23',
      validationEnabled: true,
    }
  },
  getters: {
    modules: state => state.modules,
    semesters: state => state.semesters,
    categories: state => state.categories,
    accreditedModules: state => state.accreditedModules,
    modulesByIds: state => moduleIds =>
      moduleIds.map((id) => state.modules.find((module) => module.id === id)).filter(f => f),
    totalPlannedEcts: () => getPlannedEcts(),
    totalEarnedEcts: () => getEarnedEcts(),
    allPlannedModuleIds: state => state.semesters
      .flatMap(semester => semester.moduleIds)
      .concat(state.accreditedModules.map(m => m.moduleId))
      .filter(id => id),
    startSemester: state => state.startSemester,
    studienordnung: state => state.studienordnung,
    validationEnabled: state => state.validationEnabled,
    numberOfHardValidationProblems: state =>
      state.modules.map(m => m.validationInfo).filter(f => f?.severity === 'hard').length,
    hardValidationProblemsByType: state => type =>
      state.modules.map(m => m.validationInfo).filter(f => f?.severity === 'hard' && f?.type === type),
    enrichedCategories: (state, getters) =>
      state.categories.map(category => ({
        ...category,
        earnedEcts: getEarnedEcts(category),
        plannedEcts: getPlannedEcts(category),
        colorClass: getColorClassForCategoryId(category.id),
        modules: getters.modulesByIds(category.moduleIds),
      })),
    enrichedFocuses: (state, getters) => {
      const plannedModuleIds = getters.allPlannedModuleIds;
      const numberOfModulesRequiredToGetFocus = 8;
      return state.focuses.map(focus => {
        const allModulesForFocus = getters.modulesByIds(focus.moduleIds);
        return {
          ...focus,
          numberOfMissingModules:
            Math.max(
              0,
              numberOfModulesRequiredToGetFocus - focus.moduleIds.filter(moduleId =>
                plannedModuleIds.includes(moduleId)).length
            ),
            // to only show actually available modules, we filter out predecessors of already planned ones
          availableModules: getters.modulesByIds(
            focus.moduleIds.filter(moduleId =>
              !plannedModuleIds.includes(moduleId) &&
              !plannedModuleIds.includes(allModulesForFocus.find(module => module.id === moduleId).successorModuleId)
            )
          ),
          modules: allModulesForFocus,
        };
      });
    },
    enrichedSemesters: (state, getters) =>
      state.semesters.map(semester => ({
        ...semester,
        modules: getters.modulesByIds(semester.moduleIds),
      })),
  },
  mutations: {
    setModules(state, modules: Module[]) {
      state.modules = modules;
    },
    setCategories(state, categories: Category[]) {
      state.categories = categories;
    },
    setSemesters(state, semesters: Semester[]) {
      state.semesters = semesters;
    },
    setFocuses(state, focuses: Focus[]) {
      state.focuses = focuses;
    },
    setStartSemester(state, startSemester: SemesterInfo) {
      state.startSemester = startSemester;
    },
    setStudienordnung(state, studienordnung: '21' | '23') {
      state.studienordnung = studienordnung;
    },
    setValidationEnabled(state, validationEnabled: boolean) {
      state.validationEnabled = validationEnabled;
    },
    setAccreditedModules(state, accreditedModules: AccreditedModule[]) {
      state.accreditedModules = accreditedModules;
    },

    addSemester(state) {
      const newSemester = new Semester(state.semesters.length + 1, []).setName(state.startSemester);
      state.semesters.push(newSemester);
    },
    removeSemester(state, semesterNumber: number) {
      state.semesters.splice(state.semesters.findIndex(f => f.number === semesterNumber), 1);
    },
    removeModuleFromSemester(state, data: {semesterNumber: number, moduleId: string}) {
      const semester = state.semesters.find(s => s.number === data.semesterNumber);
      const index = semester.moduleIds.indexOf(data.moduleId);
      semester.moduleIds.splice(index, 1);
    },
    addModuleToSemester(state, data: {semesterNumber: number, moduleId: string}) {
      state.semesters.find(s => s.number === data.semesterNumber).moduleIds.push(data.moduleId);
    },
    setModuleIdsForSemester(state, data: {semesterNumber: number, moduleIds: string[]}) {
      state.semesters.find(s => s.number === data.semesterNumber).moduleIds = data.moduleIds;
    },
    updateNameOfAllSemesters(state) {
      state.semesters.forEach(s => s.setName(state.startSemester));
    },
    updateNextPossibleSemesterOfAllModules(state) {
      state.modules.forEach(m => m.calculateNextPossibleSemester(state.startSemester))
    },
    updateValidationInfoOfAllModules(state, enrichedSemesters: Semester[]) {
      if(state.validationEnabled) {
        state.modules.forEach(module => module.validateModule(enrichedSemesters, state.accreditedModules));
        state.accreditedModules.forEach(module => module.validateModule(enrichedSemesters, state.accreditedModules));
      } else {
        state.modules.forEach(module => module.validationInfo = null);
        state.accreditedModules.forEach(module => module.validationInfo = null);
      }
    },
    addAccreditedModule(state, accreditedModule: AccreditedModule) {
      state.accreditedModules.push(accreditedModule);
    },
    removeAccreditedModule(state, accreditedModule: AccreditedModule) {
      state.accreditedModules.splice(state.accreditedModules.indexOf(accreditedModule), 1);
    }
  },
  actions: {
    async loadModules (context) {
      const response = await fetch(`${BASE_URL}${ROUTE_MODULES}`);
      const json = await response.json();
      const modules = json.map(m =>
        new Module(
          m.id,
          m.name,
          m.url,
          m.categoriesForColoring,
          Number(m.ects),
          m.term,
          m.recommendedModuleIds,
          m.dependentModuleIds,
          m.successorModuleId,
          m.predecessorModuleId,
          m.isDeactivated
        )
      );
      context.commit('setModules', modules);
    },
    async loadCategories (context) {
      const response = await fetch(`${BASE_URL}${store.getters.studienordnung}${ROUTE_CATEGORIES}`);
      const json = await response.json();
      const categories = json.map(c => new Category(c.id, c.name, Number(c.required_ects), c.modules.map(m => m.id)));
      context.commit('setCategories', categories);
    },
    async loadFocuses (context) {
      const response = await fetch(`${BASE_URL}${store.getters.studienordnung}${ROUTE_FOCUSES}`);
      const json = await response.json();
      const focuses = json.map(f => new Focus(f.id, f.name, f.modules.map(m => m.id)));
      context.commit('setFocuses', focuses);
    },
    async setStartSemester (context, startSemester: SemesterInfo) {
      context.commit('setStartSemester', startSemester);

      if(startSemester?.year > 2023 || (startSemester?.year === 2023 && !startSemester?.isSpringSemester)) {
        context.commit('setStudienordnung', '23');
      } else {
        context.commit('setStudienordnung', '21');
      }

      await store.dispatch('loadCategories');
      await store.dispatch('loadFocuses');

      context.commit('updateNameOfAllSemesters');
      context.commit('updateNextPossibleSemesterOfAllModules');
      store.dispatch('updateValidationInfoOfAllModules');
    },
    updateValidationInfoOfAllModules(context) {
      context.commit('updateValidationInfoOfAllModules', context.getters.enrichedSemesters);
    },
  }
});
function getEarnedEcts(category?: Category): number {
  if (store.getters.startSemester === undefined) {
    return 0;
  }
  const indexOfLastCompletedSemester = SemesterInfo.now().difference(store.getters.startSemester);

  if (indexOfLastCompletedSemester < 0) {
    return 0;
  }

  const ectsInSemesters = store.getters.enrichedSemesters
    .slice(0, indexOfLastCompletedSemester)
    .flatMap((semester) => semester.modules)
    .filter((module) => !category || category.moduleIds.includes(module.id))
    .reduce((previousTotal, module) => previousTotal + module.ects, 0);
  const accreditedEcts = store.getters.accreditedModules
    .filter(module => !category || module.categoryIds.includes(category.id))
    .reduce((previousTotal, module) => previousTotal + module.ects, 0);
  return ectsInSemesters + accreditedEcts;
}

function getPlannedEcts(category?: Category): number {
  if (store.getters.startSemester === undefined) {
    return 0;
  }

  let semestersToConsider = store.getters.enrichedSemesters;
  const indexOfLastCompletedSemester = SemesterInfo.now().difference(store.getters.startSemester);

  if (indexOfLastCompletedSemester >= 0) {
    semestersToConsider = semestersToConsider.slice(indexOfLastCompletedSemester)
  }

  return semestersToConsider
    .flatMap((semester) => semester.modules)
    .filter((module) => !category || category.moduleIds.includes(module.id))
    .reduce((previousTotal, module) => previousTotal + module.ects, 0);
}



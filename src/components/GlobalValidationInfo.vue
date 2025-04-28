<template>
  <div
    v-if="numberOfValidationProblems > 0"
    class="w-52 ml-2 text-sm bg-red-200 rounded-sm"
  >
    <Disclosure v-slot="{ open }">
      <DisclosureButton
        class="flex w-full justify-between items-center text-red-800 px-4 py-2 font-medium sm:h-8.5"
      >
        <span>Es gibt {{ numberOfValidationProblems }} Probleme:</span>
        <font-awesome-icon
          :icon="['fa', open ? 'chevron-up' : 'chevron-down']"
          class="h-5 w-5 text-red-800 ml-2"
        />
      </DisclosureButton>
      <DisclosurePanel class="w-full px-4 py-2 text-gray-500">
        <ul class="list-inside">
          <li
            v-for="problem in duplicateModulesProblems"
            :key="problem.moduleId"
            class="place-content-center"
          >
            <div class="mr-2">
              {{ problem.text }}
            </div>
            <button
              class="bg-gray-800 text-white text-xs ml-2 mb-2 mt-1  px-2 py-1 rounded-sm"
              type="button"
              @click="removeModule(problem.moduleId, problem.semesterNumbersToRemoveFrom)"
            >
              Duplikate entfernen
            </button>
          </li>
        </ul>
        <ul class="list-inside">
          <li
            v-for="problem in inactiveModuleProblems"
            :key="problem.moduleId"
            class="place-content-center"
          >
            <div class="mr-2">
              {{ problem.text }}
            </div>
            <button
              class="bg-gray-800 text-white text-xs ml-2 mb-2 mt-1 px-2 py-1 rounded-sm"
              type="button"
              @click="removeModule(problem.moduleId)"
            >
              entfernen
            </button>
            <button
              v-if="problem.successorModuleId"
              class="bg-gray-800 text-white text-xs ml-2 mb-2 mt-1  px-2 py-1 rounded-sm"
              type="button"
              @click="replaceModuleWithSuccessor(problem.moduleId, problem.successorModuleId)"
            >
              Nachfolger planen
            </button>
          </li>
        </ul>
        <ul class="list-inside">
          <li
            v-for="problem in wrongTermProblems"
            :key="problem.moduleId"
            class="place-content-center"
          >
            <div class="mr-2">
              {{ problem.text }}
            </div>
            <button
              class="bg-gray-800 text-white text-xs ml-2 mb-2 mt-1  px-2 py-1 rounded-sm"
              type="button"
              @click="removeModule(problem.moduleId)"
            >
              entfernen
            </button>
            <button
              class="bg-gray-800 text-white text-xs ml-2 mb-2 mt-1  px-2 py-1 rounded-sm"
              type="button"
              @click="moveModuleToSemester(problem.moduleId, problem.targetSemesterNumber)"
            >
              verschieben
            </button>
          </li>
        </ul>
      </DisclosurePanel>
    </Disclosure>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import type {
  ModuleValidationInfo_Duplicate,
  ModuleValidationInfo_Inactive,
  ModuleValidationInfo_WrongTerm
} from '../helpers/validation-helper';
import { store } from '../helpers/store';
import { StorageHelper } from '../helpers/storage-helper';

export default defineComponent({
  name: 'GlobalValidationInfo',
  components: { Disclosure, DisclosureButton, DisclosurePanel },
  computed: {
    numberOfValidationProblems(): number {
      return store.getters.numberOfHardValidationProblems;
    },
    wrongTermProblems(): ModuleValidationInfo_WrongTerm[] {
      return store.getters.hardValidationProblemsByType('wrongTerm');
    },
    inactiveModuleProblems(): ModuleValidationInfo_Inactive[] {
      return store.getters.hardValidationProblemsByType('inactive');
    },
    duplicateModulesProblems(): ModuleValidationInfo_Duplicate[] {
      return store.getters.hardValidationProblemsByType('duplicate');
    }
  },
  methods: {
    removeModule(moduleId: string, semesterNumbers?: number[]) {
      if(!semesterNumbers) {
        const semesterNumber = store.getters.semesters.find(sem => sem.moduleIds.includes(moduleId))?.number;
        store.commit('removeModuleFromSemester', { semesterNumber, moduleId });
      } else {
        for (const semesterNumber of semesterNumbers) {
          store.commit('removeModuleFromSemester', { semesterNumber, moduleId });
        }
      }
      this.updateUrlFragment();
    },
    moveModuleToSemester(moduleId: string, semesterNumber: number) {
      const currentSemesterNumber = store.getters.semesters.find(sem => sem.moduleIds.includes(moduleId))?.number;
      store.commit('removeModuleFromSemester', { semesterNumber: currentSemesterNumber, moduleId });
      store.commit('addModuleToSemester', { semesterNumber, moduleId });
      this.updateUrlFragment();
    },
    replaceModuleWithSuccessor(moduleId: string, successorModuleId: string) {
      const semesterNumber = store.getters.semesters.find(sem => sem.moduleIds.includes(moduleId))?.number;
      store.commit('removeModuleFromSemester', { semesterNumber, moduleId });
      store.commit('addModuleToSemester', { semesterNumber, moduleId: successorModuleId });
      this.updateUrlFragment();
    },
    updateUrlFragment() {
      StorageHelper.updateUrlFragment();
    },
  }
});

</script>

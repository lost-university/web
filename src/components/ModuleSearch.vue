<template>
  <button
    class="bg-gray-800 text-white dark:bg-gray-700 p-1 rounded-sm print:hidden"
    data-cy="ModuleSearch-OpenButton"
    type="button"
    :class="[buttonWidthClass]"
    @click="isSearching = true"
  >
    {{ textForButton }}
    <font-awesome-icon
      v-if="showChevron"
      :icon="'chevron-down'"
    />
  </button>

  <HeadlessUIDialog
    :open="isSearching"
    class="relative z-100"
    @close="() => isSearching = false"
  >
    <div class="fixed inset-0 flex w-screen items-center justify-center bg-black/30 dark:bg-black/70">
      <DialogPanel
        class="w-full max-w-4xl max-h-dvh flex flex-col
      rounded bg-white dark:bg-zinc-900 px-6 sm:py-6 shadow-2xl overflow-y-auto sm:overflow-y-hidden sm:h-3/4"
        data-cy="ModuleSearch-DialogPanel"
      >
        <div class="sticky sm:hidden z-30 pt-6 pb-4 top-0 flex justify-end dark:bg-zinc-900 bg-white">
          <button
            class="flex items-center"
            @click="isSearching= false"
          >
            <span class="pr-2">schliessen</span>
            <font-awesome-icon
              :icon="['fa', 'circle-xmark']"
              class="fa-2x"
            />
          </button>
        </div>
        <div class="relative mb-6 sm:mt-0">
          <input
            v-model="filter.query"
            type="text"
            class="w-full border border-gray-300 rounded p-2"
            placeholder="Suche nach Modul"
            data-cy="ModuleSearch-Input"
          >
          <button
            class="absolute top-0 right-0 h-full mx-2 px-1"
            @click="filter.query = ''"
          >
            <font-awesome-icon
              :icon="['fa', 'circle-xmark']"
              class="text-gray-500"
            />
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-5 sm:gap-4 grow-0 sm:overflow-y-hidden">
          <div
            class="col-span-2 overflow-y-auto mb-4"
            data-cy="ModuleSearch-Filter"
          >
            <h3>Kategorie</h3>
            <ModuleFilter
              v-model:selected="filter.categories"
              :data="categoryFilterData"
              data-cy-tag="ModuleFilter-CategoryFilter"
              :is-single-select="false"
              :is-button-group="false"
            />

            <h3 class="mt-4">
              ECTS
            </h3>
            <ModuleFilter
              v-model:selected="filter.ects"
              :data="ectsFilterData"
              :is-single-select="false"
              data-cy-tag="ModuleFilter-EctsFilter"
              is-button-group
            />

            <h3 class="mt-4">
              Frühlings- / Herbstsemester
            </h3>
            <ModuleFilter
              v-model:selected="filter.semester"
              :data="semesterFilterData"
              data-cy-tag="ModuleFilter-SemesterFilter"
              is-single-select
              is-button-group
            />
          </div>

          <div class="col-span-3 overflow-y-auto flex flex-col">
            <h3 class="sm:mt-0 mt-4">
              Module
            </h3>
            <div
              v-if="!isOneModuleAvailable"
              class="flex flex-col justify-center items-center grow"
            >
              <span class="font-bold">Keine Module verfügbar. Wende einen anderen Filter an.</span>
            </div>
            <ModuleSearchList
              :groups="groupedModules"
            />
          </div>
        </div>
      </DialogPanel>
    </div>
  </HeadlessUIDialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Module, Term } from '../helpers/types';
import { store } from '../helpers/store';
import {
  Dialog as HeadlessUIDialog,
  DialogPanel,
} from '@headlessui/vue';
import { getColorClassForCategoryId } from '../helpers/color-helper';
import { ValidationHelper } from '../helpers/validation-helper';
import ModuleFilter from "./ModuleFilter.vue";
import ModuleSearchList from "./ModuleSearchList.vue";
import type { GroupedModule } from "../types/GroupedModule";

const SEMESTER_FILTER_DATA = [
  { id: 'FS', value: 'Frühling' },
  { id: 'HS', value: 'Herbst' },
  { id: 'both', value: 'Beide' }
];

export default defineComponent({
  name: 'ModuleSearch',
  components: {
    ModuleSearchList,
    ModuleFilter,
    HeadlessUIDialog, DialogPanel
  },
  provide() {
    return {
      disableInvalidModules: this.disableInvalidModules,
      showNextPossibleSemester: this.showNextPossibleSemester,
      termForWhichToSearch: this.termForWhichToSearch,
      onModuleSelect: this.selectModule,
    }
  },
  props: {
    categoryId: {
      type: String,
      default: undefined
    },
    showNextPossibleSemester: {
      type: Boolean,
      required: true
    },
    buttonWidthClass: {
      type: String,
      required: true,
    },
    termForWhichToSearch: {
      type: String as () => Term,
      required: false,
      default: 'both'
    },
    disableInvalidModules: {
      type: Boolean,
      required: false,
      default: true,
    },
    textForButton: {
      type: String,
      default: '+'
    },
    showChevron: {
      type: Boolean,
      default: false
    }
  },
  emits: ['on-module-selected'],
  data() {
    return {
      isSearching: false,
      filter: {
        query: '',
        categories: [] as string[],
        ects: [] as number[],
        semester: [] as string[],
      },
    };
  },
  computed: {
    groupedModules(): GroupedModule[] {
      const groups = store.getters.enrichedCategories.map(c => {
        return {
          id: c.id,
          name: c.name,
          modules: c.modules,
          isOpen: this.categoryId ? this.categoryId === c.id : true,
          colorClass: getColorClassForCategoryId(c.id),
        };
      });
      const modulesInGroupIds = new Set(groups.flatMap(g => g.modules).map(m => m.id));
      const modulesNotInGroups = store.getters.modules.filter(m => !modulesInGroupIds.has(m.id));
      let filteredGroups: GroupedModule[] = groups.concat({
        id: 'none',
        name: 'Ohne',
        modules: modulesNotInGroups,
        isOpen: !this.categoryId,
        colorClass: getColorClassForCategoryId('')
      });

      if (this.filter.categories.length > 0) {
        filteredGroups = filteredGroups.filter(v => this.filter.categories.includes(v.id))
      }

      const ectsFilter = this.filter.ects;
      const semesterFilter = this.filter.semester;
      const queryFilter = this.filter.query.toLowerCase();
      const needsModuleFilter = ectsFilter.length > 0 || semesterFilter.length > 0 || queryFilter.length > 0;

      if (needsModuleFilter) {
        filteredGroups = filteredGroups.map(g => ({
          ...g,
          modules: g.modules.filter(m =>
            (ectsFilter.length === 0 || ectsFilter.includes(m.ects)) &&
            (semesterFilter.length === 0 || semesterFilter.includes(m.term as string)) &&
            (queryFilter.length === 0 || m.name.toLowerCase().includes(queryFilter))
          )
        }));
      }

      return filteredGroups;
    },
    isOneModuleAvailable(): boolean {
      return this.groupedModules.some(g => g.modules.length > 0);
    },
    categoryFilterData() {
      return store.getters.enrichedCategories.map(c => ({
        id: c.id,
        value: c.name,
        color: getColorClassForCategoryId(c.id)
      }));
    },
    ectsFilterData() {
      return [...new Set<number>(store.getters.modules.map(m => m.ects))]
        .sort((a, b) => a - b)
        .map(value => ({ id: value, value: value.toString() })) as { id: number, value: string }[];
    },
    semesterFilterData() {
      return SEMESTER_FILTER_DATA;
    },
  },
  methods: {
    moduleIsDisabled(module: Module): boolean {
      return this.moduleIsInPlan(module) || (this.disableInvalidModules && (
        this.moduleHasWrongTerm(module) ||
        module.isDeactivated ||
        (this.showNextPossibleSemester && !module.nextPossibleSemester)));
    },
    moduleIsInPlan(module: Module): boolean {
      return (store.getters.allPlannedModuleIdsSet as Set<string>).has(module.id);
    },
    moduleHasWrongTerm(module: Module): boolean {
      return ValidationHelper.isModuleInWrongTerm(module, this.termForWhichToSearch);
    },
    selectModule(moduleId: string) {
      if (moduleId) {
        // can be null, if Combobox is closed through blur
        this.$emit('on-module-selected', moduleId);
      }
      this.isSearching = false;
      this.filter = {
        query: '',
        categories: [],
        ects: [] as number[],
        semester: [] as string[],
      };
    },
  }
});
</script>

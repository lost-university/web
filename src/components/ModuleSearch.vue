<template>
  <button
    class="bg-gray-800 text-white p-1 rounded-sm"
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
    <div class="fixed inset-0 flex w-screen items-center justify-center">
      <DialogPanel
        class="w-full max-w-4xl max-h-dvh flex flex-col
      rounded bg-white p-6 shadow-2xl overflow-y-auto sm:overflow-y-hidden sm:h-3/4"
        data-cy="ModuleSearch-DialogPanel"
      >
        <div class="flex sm:hidden justify-end mb-2">
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
        <div class="relative mb-6">
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

        <div class="grid grid-cols-1 sm:grid-cols-5 gap-4 grow-0 sm:overflow-y-hidden">
          <div
            class="col-span-2 overflow-y-auto mb-4"
            data-cy="ModuleSearch-Filter"
          >
            <h3>Kategorie</h3>
            <ModuleFilter
              v-model:selected="filter.categories"
              :data="categoryFilterData()"
              data-cy-tag="ModuleFilter-CategoryFilter"
              :is-single-select="false"
              :is-button-group="false"
            />

            <h3 class="mt-4">
              ECTS
            </h3>
            <ModuleFilter
              v-model:selected="filter.ects"
              :data="ectsFilterData()"
              :is-single-select="false"
              data-cy-tag="ModuleFilter-EctsFilter"
              is-button-group
            />

            <h3 class="mt-4">
              Frühlings- / Herbstsemester
            </h3>
            <ModuleFilter
              v-model:selected="filter.semester"
              :data="semesterFilterData()"
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
      isOneModuleAvailable: true,
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
      const modulesInGroups = groups.flatMap(g => g.modules).map(m => m.id);
      const modulesNotInGroups = store.getters.modules.filter(m => !modulesInGroups.includes(m.id));
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

      if (this.filter.ects.length > 0) {
        filteredGroups = filteredGroups.map(g => {
          return {
            ...g,
            modules: g.modules.filter(m => this.filter.ects.includes(m.ects))
          }
        });
      }

      if (this.filter.semester.length > 0) {
        filteredGroups = filteredGroups.map(g => {
          return {
            ...g,
            modules: g.modules.filter(m => this.filter.semester.includes(m.term as string))
          }
        });
      }

      if (this.filter.query.length > 0) {
        filteredGroups = filteredGroups.map(g => {
          return {
            ...g,
            modules: g.modules.filter(m => m.name.toLowerCase().includes(this.filter.query.toLowerCase()))
          }
        });
      }

      return filteredGroups;
    }
  },
  watch: {
    groupedModules: {
      handler(newValue) {
        const modules = newValue.flatMap(g => {
          return g.modules
        })

        this.isOneModuleAvailable = modules.length !== 0;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    moduleIsDisabled(module: Module): boolean {
      return this.moduleIsInPlan(module) || (this.disableInvalidModules && (
        this.moduleHasWrongTerm(module) ||
        module.isDeactivated ||
        (this.showNextPossibleSemester && !module.nextPossibleSemester)));
    },
    moduleIsInPlan(module: Module): boolean {
      return store.getters.allPlannedModuleIds.includes(module.id);
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
    categoryFilterData() {
      return store.getters.enrichedCategories.map(c => {
        return {
          id: c.id,
          value: c.name,
          color: getColorClassForCategoryId(c.id)
        };
      });
    },
    ectsFilterData() {
      return store.getters.modules.map(m => {
        return m.ects
      }).filter((value: number, index: number, self: number[]) => {
        return self.indexOf(value) === index;
      }).sort((a: number, b: number) => a - b).map((value: number) => {
        return {
          id: value,
          value: value.toString()
        };
      }) as { id: number, value: string }[];
    },
    semesterFilterData() {
      return [
        {
          id: 'FS',
          value: 'Frühling'
        },
        {
          id: 'HS',
          value: 'Herbst'
        },
        {
          id: 'both',
          value: 'Beide'
        }];
    },
  }
});
</script>

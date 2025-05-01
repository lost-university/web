<template>
  <button
    v-if="!isSearching"
    class="bg-gray-800 text-white p-1 rounded-sm"
    type="button"
    :class="[buttonWidthClass]"
    @click="startSearching()"
  >
    {{ textForButton }}
    <font-awesome-icon
      v-if="showChevron"
      :icon="'chevron-down'"
    />
  </button>
  <Combobox
    v-if="false"
    :model-value="modelValue"
    by="id"
    nullable
    @update:model-value="value => selectModule(value)"
  >
    <div
      class="relative w-full h-8 rounded-t-lg shadow-md flex items-center"
    >
      <div
        class="absolute flex bg-gray-100 py-2 px-3 space-x-1 rounded-t"
        :class="[listWidthClass]"
      >
        <ComboboxInput
          ref="comboboxInput"
          class="w-full border-none text-sm"
          :display-value="(e) => e?.id"
          @change="query = $event.target.value"
        />
        <ComboboxButton
          ref="buttonForOpening"
          class="w-0 h-0"
        />
        <button
          class="my-auto"
          type="button"
          @click="isSearching = false"
        >
          <font-awesome-icon :icon="['fa', 'circle-xmark']" />
        </button>
      </div>
    </div>
    <ComboboxOptions
      static
      :class="[listWidthClass, containerBound ? 'inherit' : 'absolute']"
      class="max-h-72 overflow-auto rounded-b-md shadow-lg bg-gray-100 z-40"
    >
      <div
        v-for="group in groupedModules"
        :key="group.id"
      >
        <div
          class="cursor-pointer px-2 text-white flex justify-between items-center"
          :class="group.colorClass"
          :aria-expanded="group.isOpen"
          type="button"
          @click="toggleGroup(group.id)"
        >
          <span>{{ group.name }}</span>
          <font-awesome-icon
            :icon="['fa', group.isOpen ? 'chevron-up' : 'chevron-down']"
            class="h-5 w-5 ml-2"
          />
        </div>

        <ComboboxOption
          v-for="module in filteredModulesByGroup(group.id)"
          v-show="group.isOpen"
          :key="module.id"
          :value="module.id"
          as="template"
          :disabled="moduleIsDisabled(module)"
        >
          <li
            class="pl-3 border-b border-slate-500 flex items-center"
            :class="moduleIsDisabled(module) ?
              'text-gray-400 bg-gray-300 cursor-default' :
              'cursor-pointer hover:bg-gray-200'"
          >
            <span
              class="w-3/5 block break-words font-normal"
            >
              {{ module.name }}
            </span>

            <div class="w-1/5 text-xs">
              <span
                v-if="moduleIsInPlan(module)"
                class="italic"
              >
                geplant
              </span>
              <span v-else-if="module.isDeactivated && disableInvalidModules">
                inaktiv
              </span>
              <span v-else>
                {{ module.ects }} ECTS
              </span>
            </div>

            <div class="w-1/5 text-xs">
              <span v-if="showNextPossibleSemester && module.nextPossibleSemester">
                ({{ module.nextPossibleSemester }})
              </span>
              <span v-else-if="moduleHasWrongTerm(module) && disableInvalidModules">
                nur im {{ module.term }}
              </span>
              <span v-else>
                {{ module.getDisplayTextForTerm() }}
              </span>
            </div>
          </li>
        </ComboboxOption>
      </div>
    </ComboboxOptions>
  </Combobox>

  <HeadlessUIDialog
    :open="isSearching"
    class="relative z-100"
    @close="() => isSearching = false"
  >
    <div class="fixed inset-0 flex w-screen items-center justify-center">
      <DialogPanel
        class="w-full max-w-4xl max-h-dvh flex flex-col
      rounded bg-white p-6 shadow-2xl overflow-y-auto sm:overflow-y-hidden sm:max-h-3/4"
      >
        <div class="relative mb-6">
          <input
            v-model="filter.query"
            type="text"
            class="w-full border border-gray-300 rounded p-2"
            placeholder="Suche nach Modul oder Dozent"
          >
          <button class="absolute top-0 right-0 h-full mx-2 px-1">
            <font-awesome-icon
              :icon="['fa', 'circle-xmark']"
              class="text-gray-500"
            />
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-5 gap-4 grow-0 sm:overflow-y-hidden">
          <div class="col-span-2 mb-4">
            <h3>Kategorie</h3>
            <ModuleFilter
              v-model:selected="filter.categories"
              :data="categoryFilterData()"
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
              is-button-group
            />

            <h3 class="mt-4">
              Frühlings- / Herbstsemester
            </h3>
            <ModuleFilter
              v-model:selected="filter.semester"
              :data="semesterFilterData()"
              is-single-select
              is-button-group
            />
          </div>

          <div class="col-span-3 overflow-y-auto">
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
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxButton,
  Dialog as HeadlessUIDialog,
  DialogPanel,
} from '@headlessui/vue';
import { getColorClassForCategoryId } from '../helpers/color-helper';
import { ValidationHelper } from '../helpers/validation-helper';
import ModuleFilter from "./ModuleFilter.vue";
import ModuleSearchList from "./ModuleSearchList.vue";

export type GroupedModule = {
  id: string,
  name: string,
  modules: Module[],
  isOpen: boolean,
  colorClass: object
};

export default defineComponent({
  name: 'ModuleSearch',
  components: {
    ModuleSearchList,
    ModuleFilter,
    Combobox, ComboboxInput, ComboboxOptions, ComboboxOption, ComboboxButton,
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
    listWidthClass: {
      type: String,
      default: 'w-72'
    },
    containerBound: {
      type: Boolean,
      default: false
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
      searchId: Math.random(),
      // OLD
      modelValue: null,
      query: '',
      // OLD end

      filter: {
        query: '',
        categories: [],
        ects: [] as number[],
        semester: [] as string[],
      },
      // groupedModules: [] as GroupedModule[],
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
      let filteredGroups =  groups.concat({
        id: 'none',
        name: 'Ohne',
        modules: modulesNotInGroups,
        isOpen: this.categoryId ? false : true,
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
            modules: g.modules.filter(m => this.filter.semester.includes(m.term))
          }
        });
      }

      return filteredGroups;
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
    startSearching() {
      if (!this.isSearching) {
        // const groups = store.getters.enrichedCategories.map(c => {
        //   return {
        //     id: c.id,
        //     name: c.name,
        //     modules: c.modules,
        //     isOpen: this.categoryId ? this.categoryId === c.id : true,
        //     colorClass: getColorClassForCategoryId(c.id),
        //   };
        // });
        // const modulesInGroups = groups.flatMap(g => g.modules).map(m => m.id);
        // const modulesNotInGroups = store.getters.modules.filter(m => !modulesInGroups.includes(m.id));
        // this.groupedModules = groups.concat({
        //   id: 'none',
        //   name: 'Ohne',
        //   modules: modulesNotInGroups,
        //   isOpen: this.categoryId ? false : true,
        //   colorClass: getColorClassForCategoryId('')
        // });
      }
      this.query = '';
      this.isSearching = true;
      // this.$nextTick(() => {
      //   const buttonForOpening = this.$refs.buttonForOpening;
      //   if (buttonForOpening.el) {
      //     // this focuses the input and ensures that blur will close the list
      //     buttonForOpening.el.click();
      //   }
      // });
    },
    toggleGroup(id: string) {
      // const group = this.groupedModules.find(f => f.id === id);
      // // group.isOpen = !group.isOpen;
      // this.groupedModules = [...this.groupedModules];
    },
    filteredModulesByGroup(groupId: string) {
      const group = this.groupedModules.find(f => f.id === groupId);
      if (this.query === '') {
        return group?.modules;
      }
      return group?.modules.filter((module) => {
        return module.name.toLowerCase().includes(this.query.toLowerCase()) ||
          module.id.toLowerCase().includes(this.query.toLowerCase());
      })
    },
  }
});
</script>

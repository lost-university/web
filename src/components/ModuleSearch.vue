<template>
  <button
    v-if="!isSearching"
    class="h-8 bg-gray-800 text-white p-1 rounded"
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
  <div
    v-if="isSearching"
    :class="[listWidthClass]"
  >
    <Combobox
      :model-value="modelValue"
      by="id"
      nullable
      @update:model-value="value => selectModule(value)"
    >
      <div class="relative w-full h-8 overflow-hidden rounded-t-lg shadow-md flex items-center">
        <ComboboxInput
          ref="comboboxInput"
          class="relative w-full border-none text-sm py-2 pl-3 pr-10 bg-gray-100"
          :display-value="(e) => e?.id"
          @change="query = $event.target.value"
        />
        <ComboboxButton
          ref="buttonForOpening"
          class="absolute right-0 w-0 h-0"
        >
          Button
        </ComboboxButton>
        <button
          class="absolute right-2 my-auto"
          type="button"
          @click="isSearching = false"
        >
          <font-awesome-icon :icon="['fa', 'circle-xmark']" />
        </button>
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
            class="hover:cursor-pointer px-2 text-white flex justify-between items-center"
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
  </div>
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
  ComboboxButton
  } from '@headlessui/vue';
import { getColorClassForCategoryId } from '../helpers/color-helper';
import { ValidationHelper } from '../helpers/validation-helper';
import { SemesterInfo } from '../helpers/semester-info';

export type GroupedModule = {id: string, name: string, modules: Module[], isOpen: boolean, colorClass: object };

export default defineComponent({
  name: 'ModuleSearch',
  components: { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption, ComboboxButton },
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
      modelValue: null,
      query: '',
      groupedModules: [] as GroupedModule[],
    };
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
      return ValidationHelper.isModuleInWrongTerm(module, SemesterInfo.nextSemester(this.termForWhichToSearch)!);
    },
    selectModule(moduleId: string) {
      if (moduleId) {
        // can be null, if Combobox is closed through blur
        this.$emit('on-module-selected', moduleId);
      }
      this.isSearching = false;
    },
    startSearching() {
      if(!this.isSearching) {
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
        this.groupedModules =  groups.concat({
          id: 'none',
          name: 'Ohne',
          modules: modulesNotInGroups,
          isOpen: this.categoryId ? false : true,
          colorClass: getColorClassForCategoryId('')
        });
      }
      this.query = '';
      this.isSearching = true;
      this.$nextTick(() => {
          const buttonForOpening = this.$refs.buttonForOpening;
          if(buttonForOpening.el) {
            // this focuses the input and ensures that blur will close the list
            buttonForOpening.el.click();
          }
        });
    },
    toggleGroup(id: string) {
      const group = this.groupedModules.find(f => f.id === id);
      group.isOpen = !group.isOpen;
      this.groupedModules = [...this.groupedModules];
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
  },
});
</script>

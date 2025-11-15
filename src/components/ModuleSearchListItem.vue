<template>
  <li
    class="px-2 py-1 border-b border-slate-500 flex items-center last:rounded-b-sm last:border-b-0"
    :class="moduleIsDisabled ?
      'text-gray-400 bg-gray-300 dark:bg-zinc-700 cursor-default' :
      'cursor-pointer hover:bg-gray-200'"
    data-cy="ModuleSearch-ModuleListItem"
    @click="!moduleIsDisabled ? onModuleSelect(module.id) : null"
  >
    <div
      class="w-4/6"
      data-cy="ModuleSearch-ModuleListItem-ModuleName"
    >
      {{ module.name }}
    </div>
    <div class="text-right w-1/6">
      <span
        v-if="moduleIsInPlan"
        class="italic"
      >
        geplant
      </span>
      <span v-else-if="module.isDeactivated && disableInvalidModules">
        inaktiv
      </span>
      <span
        v-else
        data-cy="ModuleSearch-ModuleListItem-ECTS"
      >
        {{ module.ects }} ECTS
      </span>
    </div>
    <div class="w-1/6 text-xs text-center">
      <span v-if="showNextPossibleSemester && module.nextPossibleSemester">
        ({{ module.nextPossibleSemester }})
      </span>
      <span v-else-if="moduleHasWrongTerm && disableInvalidModules">
        nur im {{ module.term }}
      </span>
      <span v-else>
        {{ module.displayTextForTerm }}
      </span>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { Module, Term } from "../helpers/types";
import { store } from "../helpers/store";
import { ValidationHelper } from "../helpers/validation-helper";

export default defineComponent({
  name: "ModuleSearchListItem",
  inject: ['disableInvalidModules', 'showNextPossibleSemester', 'termForWhichToSearch', 'onModuleSelect'],
  props: {
    module: {
      type: Object as PropType<Module>,
      required: true
    },
  },
  computed: {
    moduleIsInPlan(): boolean {
      return store.getters.allPlannedModuleIds.includes(this.module.id);
    },
    moduleIsDisabled(): boolean {
      return this.moduleIsInPlan || (this.disableInvalidModules && (
        this.moduleHasWrongTerm ||
        this.module.isDeactivated ||
        (this.showNextPossibleSemester && !this.module.nextPossibleSemester))) as boolean;
    },
    moduleHasWrongTerm(): boolean {
      return ValidationHelper.isModuleInWrongTerm(this.module, this.termForWhichToSearch as Term);
    },
  }
})
</script>

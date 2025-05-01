<template>
  <li
    class="px-2 py-1 border-b border-slate-500 flex justify-between items-center last:rounded-b-sm last:border-b-0"
    :class="moduleIsDisabled(module) ?
      'text-gray-400 bg-gray-300 cursor-default' :
      'cursor-pointer hover:bg-gray-200'"
    @click="!moduleIsDisabled(module) ? onModuleSelect(module.id) : null"
  >
    <span class="max-w-3/4">{{ module.name }}</span>
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
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Module } from "../helpers/types";
import { store } from "../helpers/store";
import { ValidationHelper } from "../helpers/validation-helper";

export default defineComponent({
  name: "ModuleSearchListItem",
  inject: ['disableInvalidModules', 'showNextPossibleSemester', 'termForWhichToSearch', 'onModuleSelect'],
  props: {
    module: {
      type: Object,
      required: true
    },
  },
  methods: {
    moduleIsInPlan(module: Module): boolean {
      return store.getters.allPlannedModuleIds.includes(module.id);
    },
    moduleIsDisabled(module: Module): boolean {
      return this.moduleIsInPlan(module) || (this.disableInvalidModules && (
        this.moduleHasWrongTerm(module) ||
        module.isDeactivated ||
        (this.showNextPossibleSemester && !module.nextPossibleSemester)));
    },
    moduleHasWrongTerm(module: Module): boolean {
      return ValidationHelper.isModuleInWrongTerm(module, this.termForWhichToSearch);
    },
  }
})
</script>

<template>
  <button
    class="bg-gray-800 text-white p-1 rounded"
    type="button"
    :class="{ 'collapse h-0': isSearching, ...widthClass }"
    @click="isSearching = true"
  >
    +
  </button>
  <div :class="{ 'collapse h-0': !isSearching }">
    <select
      :id="'modules' + searchId"
      class="w-full bg-pink-100"
      @change="selectModule($event)"
    >
      <option
        value=""
        selected
        disabled
      >
        Choose
      </option>
      <option
        v-for="selectableModule in modules"
        :key="selectableModule.id"
        :value="selectableModule.name"
        :disabled="
          moduleIsInPlan(selectableModule) ||
          moduleHasWrongTerm(selectableModule) ||
          (showNextPossibleSemester && !selectableModule.nextPossibleSemester)"
      >
        {{ selectableModule.name }}
        <span v-if="moduleIsInPlan(selectableModule)">
          bereits eingeplant
        </span>
        <div v-if="!moduleIsInPlan(selectableModule)">
          <span v-if="showNextPossibleSemester && selectableModule.nextPossibleSemester">
            ({{ selectableModule.nextPossibleSemester }})
          </span>
          <span v-if="moduleHasWrongTerm(selectableModule)">
            nur im {{ selectableModule.term }}
          </span>
        </div>
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Module, Term } from '../helpers/types';
import { store } from '../helpers/store';

export default defineComponent({
  name: 'ModuleSearch',
  props: {
    modules: {
      type: Array<Module>,
      required: true,
    },
    showNextPossibleSemester: {
      type: Boolean,
      required: true
    },
    widthClass: {
      type: Object,
      required: true
    },
    termForWhichToSearch: {
      type: String as () => Term,
      required: false,
      default: 'both'
    }
  },
  emits: ['on-module-selected'],
  data() {
    return {
      isSearching: false,
      searchId: Math.random(),
    };
  },
  watch: {
    modules: {
      deep: true,
      immediate: false,
      handler() {
        this.isSearching = false;
      },
    },
  },
  methods: {
    selectModule(event: Event) {
      const el = (<HTMLSelectElement>event.currentTarget);
      this.$emit('on-module-selected', el.value);
      el.value = '';
      this.isSearching = false;
    },
    moduleIsInPlan(module: Module): boolean {
      return store.getters.plannedModuleIds.includes(module.id);
    },
    moduleHasWrongTerm(module: Module): boolean {
      if(this.termForWhichToSearch !== 'both' && module.term !== 'both') {
        return this.termForWhichToSearch !== module.term;
      }
      return false;
    }
  },
});
</script>

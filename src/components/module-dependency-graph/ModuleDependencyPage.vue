<template>
  <div class="columns">
    <div class="column">
      <ModuleDependencyDropdown :all-modules="allModules"
        @on-modules-selection-changed="(modules: Module[]) => onModulesSelectionChanged(modules)">
      </ModuleDependencyDropdown>
    </div>
    <div class="column">
      INFO
    </div>
  </div>
  <div class="columns">
    <div class="column">
      <ModuleDependencyGraph :modules="selectedModules"></ModuleDependencyGraph>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Module } from '../../helpers/types';
import ModuleDependencyDropdown from './ModuleDependencyDropdown.vue';
import ModuleDependencyGraph from './ModuleDependencyGraph.vue';

const BASE_URL = 'https://raw.githubusercontent.com/lost-university/data/3.1/data';
const ROUTE_MODULES = '/modules.json';

export default defineComponent({
  name: 'ModuleDependencyPage',
  // props: {
  //   allModules: {
  //     type: Array<Module>,
  //     required: true,
  //   },
  // },
  components: {
    ModuleDependencyDropdown,
    ModuleDependencyGraph,
  },
  data() {
    return {
      selectedModules: [] as Module[],
      allModules: [] as Module[],
    }
  },
  async mounted() {
    this.allModules = await this.getModules();
    console.log('allModules', this.allModules);
  },
  methods: {
    async getModules(): Promise<Module[]> {
      const response = await fetch(`${BASE_URL}${ROUTE_MODULES}`);
      return response.json();
    },
    onModulesSelectionChanged(selectedModules: Module[]) {
      this.selectedModules = selectedModules;
    },
  }
});
</script>

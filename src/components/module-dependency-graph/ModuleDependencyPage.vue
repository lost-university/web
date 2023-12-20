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
          <ModuleDependencyGraph :selectedModules="selectedModules" :modulesToDisplay="modulesForGraph"></ModuleDependencyGraph>
        </div>
      </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Module } from '../../helpers/types';
import ModuleDependencyDropdown from './ModuleDependencyDropdown.vue';
import ModuleDependencyGraph from './ModuleDependencyGraph.vue';

const BASE_URL = 'https://raw.githubusercontent.com/lost-university/data/more-data-for-modules/data';
const ROUTE_MODULES = '/modules.json';

export default defineComponent({
  name: 'ModuleDependencyPage',
  components: {
    ModuleDependencyDropdown,
    ModuleDependencyGraph,
  },
  data() {
    return {
      modulesForGraph: [] as Module[],
      allModules: [] as Module[],
      selectedModules: [] as Module[],
    }
  },
  async mounted() {
    this.allModules = await this.getModules();
  },
  methods: {
    async getModules(): Promise<Module[]> {
      const response = await fetch(`${BASE_URL}${ROUTE_MODULES}`);
      return response.json();
    },
    onModulesSelectionChanged(selectedModules: Module[]) {
      const recommended = <Module[]>[];
      for (const module of selectedModules) {
        this.getRecommendedModulesForModule(module, recommended);
      }

      const recommending = <Module[]>[];
      const recommended2 = <Module[]>[];
      for (const module of selectedModules) {
        this.getRecommendingModulesForModule(module, recommending);
        this.getRecommendedModulesForModule(module, recommended2);
      }

      this.modulesForGraph = [...recommended, ...recommended2, ...selectedModules, ...recommending].filter((value, index, array) => array.indexOf(value) === index);
      this.selectedModules = selectedModules;
    },
    getRecommendedModulesForModule(module: Module, visited: Module[]): Module[] {
      const recommended = module.recommendedModuleIds.map(m => this.allModules.find(f => f.id === m));
      for (const rec of recommended) {
        if (!rec || visited.some(v => v.id === rec.id)) {
          continue;
        }
        visited.push(rec);
        this.getRecommendedModulesForModule(rec, visited);
      }
      return visited;
    },
    getRecommendingModulesForModule(module: Module, visited: Module[]): Module[] {
      const recommending = this.allModules.filter(f => f.recommendedModuleIds.includes(module.id));
      for (const rec of recommending) {
        if (!rec || visited.some(v => v.id === rec.id)) {
          continue;
        }
        visited.push(rec);
        this.getRecommendingModulesForModule(rec, visited);
      }
      return visited;
    },
  }
});
</script>

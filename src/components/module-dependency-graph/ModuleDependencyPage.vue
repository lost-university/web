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
                                                <ModuleDependencyGraph :modules="modulesForGraph"></ModuleDependencyGraph>
                                        </div>
                                      </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
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
      const recommended = <Module[]>[];
      const recommending = <Module[]>[];
      for (const module of selectedModules) {
        this.getRecommendedModulesForModule(module, recommended);
      }
      for (const module of selectedModules) {
        this.getRecommendingModulesForModule(module, recommending);
      }
      console.log('selected', selectedModules);
      console.log('total recommended', recommended.map(m => m.id));
      console.log('total recommending', recommending.map(m => m.id));
      this.modulesForGraph = [...selectedModules, ...recommended, ...recommending].filter((value, index, array) => array.indexOf(value) === index);
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
    }


    // getRelatedModulesForModule(module: Module, collectedModules: Module[]): Module[] {
    //   collectedModules = this.pushIfDistinct(module, collectedModules);
    //   // get referencing
    //   const referencingModules = this.allModules.filter(f => f.recommendedModuleIds.includes(module.id));
    //   for (const ref of referencingModules) {
    //     collectedModules = this.getRelatedModulesForModule(ref, collectedModules);
    //     // collectedModules.push(...this.getRelatedModulesForModule(ref));
    //   }
    //   // get referenced
    //   const referencedModules = <Module[]>module.recommendedModuleIds.map(id => this.allModules.find(f => f.id === id)).filter(f => f);
    //   for (const ref of referencedModules) {
    //     collectedModules = this.getRelatedModulesForModule(ref, collectedModules);
    //     // collectedModules.push(...this.getRelatedModulesForModule(ref));
    //   }

    //   return collectedModules;
    // },
    // pushIfDistinct(module: Module, modules: Module[]): Module[] {
    //   if (!modules.includes(module)) {
    //     modules.push(module);
    //   }
    //   return modules;
    // },
    // print(module: Module) {
    //   console.log('module', module.id);

    //   // go down from down and up from up

    //   // const referenced = module.recommendedModuleIds.map(m => this.allModules.find(f => f.id === m));
    //   // const referencing = this.allModules.filter(f => f.recommendedModuleIds.includes(module.id));
    //   // console.log('referenced', referenced.reduce((a, b) => a += (' ' + b?.id), ''));
    //   // console.log('referencing', referencing.reduce((a, b) => a += (' ' + b?.id), ''));
    //   // referenced.forEach(r => r ? this.print(r, visited) : null);
    //   // referencing.forEach(r => this.print(r, visited));
    //   this.printReferenced(module);
    //   this.printReferencing(module);
    // },
    // printReferencing(module: Module) {
    //   console.log('referencing', module.id);
    //   const referencing = this.allModules.filter(f => f.recommendedModuleIds.includes(module.id));
    //   referencing.forEach(r => this.printReferencing(r));
    // },
    // printReferenced(module: Module) {
    //   console.log('referenced', module.id);
    //   const referenced = module.recommendedModuleIds.map(m => this.allModules.find(f => f.id === m));
    //   referenced.forEach(r => r ? this.printReferencing(r) : null);
    // },
  }
});
</script>

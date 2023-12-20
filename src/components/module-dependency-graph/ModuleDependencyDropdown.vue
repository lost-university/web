<template>
  <div class="is-flex is-align-content-space-evenly is-justify-content-left">
    <label class="is-flex is-flex-direction-column is-justify-content-center" for="modules-select">
      <p>Module</p>
    </label>
    <div class="select pl-2">
      <select id="modules-select">
        <option v-for="module in unselectedModules" :key="module.id" @click="onModuleSelected(module.id)">
          {{ module.name }}
        </option>
      </select>
    </div>
  </div>

  <div class="is-flex mt-2">
    <template v-for="module in selectedModules" :key="module.id">
      <div class="selected-module p-2" :style="{ 'background-color': getCategoryColorForModule(module), 'margin-right': '1em' }">
        {{ module.name }}
        <button
          class="delete-button delete is-pulled-right ml-1"
          type="button"
          @click="onModuleDeselected(module.id)">X</button>
      </div>
    </template>
  </div>
</template>

<style>
.selected-module {
  color: white;
  border-radius: 5px;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Module } from '../../helpers/types';
import { getCategoryColorForModule } from '../../helpers/color-helper';

export default defineComponent({
  name: 'ModuleDependencyDropdown',
  props: {
    allModules: {
      type: Array<Module>,
      required: true,
    },
  },
  emits: ['on-modules-selection-changed'],
  data() {
    return {
      unselectedModules: [] as Module[],
      selectedModules: [] as Module[],
    }
  },
  watch: {
    allModules: {
      deep: true,
      immediate: false,
      handler() {
        this.unselectedModules = this.allModules.sort((a, b) => a.name > b.name ? 1 : -1);
      },
    },
  },
  methods: {
    getCategoryColorForModule,
    onModuleSelected(moduleId: string) {
      console.log('onModuleSelected', moduleId);
      const module = this.unselectedModules.find(f => f.id === moduleId);
      if (!module) {
        return;
      }
      console.log('module', module);
      this.selectedModules = [...this.selectedModules, module].sort((a, b) => a.name > b.name ? 1 : -1);
      this.unselectedModules = this.unselectedModules.filter(f => f.id !== moduleId);
      this.$emit('on-modules-selection-changed', this.selectedModules);
    },
    onModuleDeselected(moduleId: string) {
      const module = this.selectedModules.find(f => f.id === moduleId);
      if (!module) {
        return;
      }
      this.unselectedModules = [...this.unselectedModules, module].sort((a, b) => a.name > b.name ? 1 : -1);
      this.selectedModules = this.selectedModules.filter(f => f.id !== moduleId);
      this.$emit('on-modules-selection-changed', this.selectedModules);
    }
  }
});
</script>

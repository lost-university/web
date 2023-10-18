<template>
  <!-- <div class="has-dropdown is-hoverable">
    <a>Module</a>
    <div class="navbar-dropdown">
      <a v-for="module in unselectedModules" :key="module.id" class="navbar-item" @click="onModuleSelected(module.id)"
        v-text="module.name" />
    </div>
  </div> -->

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

  <div>
    <template v-for="module in selectedModules" :key="module.id">
      <div style="background-color: pink; margin-right: 1em;">{{ module.name }} <button
          @click="onModuleDeselected(module.id)">X</button></div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Module } from '../../helpers/types';

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

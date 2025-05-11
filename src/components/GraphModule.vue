<template>
  <div
    ref="itemRef"
    :key="module.name + id"
    class="rounded-sm group/module relative p-2 px-8 flex flex-col
    items-center text-center text-white w-full module-node"
    :class="computedClasses"
  >
    <Handle
      type="target"
      :position="Position.Left"
      :style="{ top: '50%', transform: 'translate(0, -50%)', background: '#555', visibility: 'hidden'}"
    />
    
    
    <button
      v-if="hasDependentModules()"
      class="add-pedendent-modules absolute opacity-0 touch-only:opacity-75 group-hover/module:opacity-75
             hover:!opacity-100 right-2 -bottom-1 transform -translate-y-1/2 transition-opacity duration-75"
      type="button"
      @click="toggleList('right')"
    >
      <font-awesome-icon
        :icon="['fa', 'plus-circle']"
        size="lg"
      />
    </button>

    <button
      v-if="hasRecommendedModules()"
      class="add-recommended-modules absolute opacity-0 touch-only:opacity-75 group-hover/module:opacity-75
             hover:!opacity-100 left-2 -bottom-1 transform -translate-y-1/2 transition-opacity duration-75"
      type="button"
      @click="toggleList('left')"
    >
      <font-awesome-icon
        :icon="['fa', 'plus-circle']"
        size="lg"
      />
    </button>

    <button
     
      class="remove-module absolute opacity-0 touch-only:opacity-75 group-hover/module:opacity-75
             hover:!opacity-100 right-2 transition-opacity duration-75"
      type="button"
      @click="removeModule"
    >
      <font-awesome-icon
        :icon="['fa', 'circle-xmark']"
        size="lg"
      />
    </button>

    <a
      class="font-bold hover:underline"
      target="_blank"
      :href="'https://studien.ost.ch/' + module.url.replace('.json', '.html')"
    >{{ module.name }}
    </a>
    <p>{{ module.ects }} ECTS</p>

    <Handle
      type="source"
      :position="Position.Right"
      :style="{ top: '50%', transform: 'translateY(-50%)', background: '#555', visibility: 'hidden'}"
    />
  </div>

  <div
    v-if="showList"
    class="absolute inset-y-0 w-60 bg-black bg-opacity-75 flex items-center justify-center z-100"
    :class="[ listSide === 'left' ? '-left-55' : '-right-55' ]"
    @click.self="hideList"
    @mouseleave="hideList"
  >
    <ModuleList
      :modules="listSide === 'left' ? recommendedModules() : dependentModules()"
      @module-selected="onModuleSelected"
      @module-added="hideList"
    />
  </div>
</template>

<script lang="ts">
import { type PropType, defineComponent } from 'vue';
import { Handle, Position } from '@vue-flow/core';
import { getColorClassForPrioritizedCategory } from '../helpers/color-helper';
import type { Module } from '../helpers/types';
import ModuleList from './GraphModuleList.vue';
import moduleCatalog from '../helpers/temporaryModuleCatalog';
import { store } from '../helpers/store';
import { StorageHelper } from '../helpers/storage-helper';

export default defineComponent({
  name: 'Module',
  components: {
    Handle,
    ModuleList,
  },
  props: {
    module: {
      type: Object as PropType<Module>,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
  },
  emits: ['on-delete', 'module-selected'],
  data() {
    return {
      showList: false,
      listSide: 'left',
      catalog: moduleCatalog,
      Position,
    };
  },
  computed: {
    computedClasses(): string[] {
      const classes = [
        this.getColorClassForPrioritizedCategory(
          this.module.categoriesForColoring
        ),
      ];
      if (this.module.validationInfo?.severity === 'hard') {
        classes.push('border-red-500', 'border-4');
      }
      return classes;
    },
  },
  methods: {
    toggleList(side: 'left' | 'right') {
      this.listSide = side;
      this.showList = !this.showList;
    },
    hideList() {
      this.showList = false;
    },
    getColorClassForPrioritizedCategory,
    getElement() {
      return this.$refs.itemRef as HTMLElement;
    },
    onModuleSelected(mod: Module) {
      this.$emit('module-selected', { parentId: this.id, module: mod });
      this.showList = false;
    },
    recommendedModules(): Module[] {
      const allModules = store.getters.modules as Module[];
      const plannedModuleIds = store.getters.allPlannedModuleIds as string[];
      return this.module.recommendedModuleIds
        .map((modId) => allModules.find((m) => m.id === modId))
        .filter((m) => m && !plannedModuleIds.includes(m.id))
        .filter((m): m is Module => Boolean(m));
    },
    dependentModules(): Module[] {
      const allModules = store.getters.modules as Module[];
      const plannedModuleIds = store.getters.allPlannedModuleIds as string[];
      return this.module.dependentModuleIds
        .map((modId) => allModules.find((m) => m.id === modId))
        .filter((m) => m && !plannedModuleIds.includes(m.id))
        .filter((m): m is Module => Boolean(m));
    },
    hasRecommendedModules(): boolean {
      return this.recommendedModules().length > 0;
    },
    hasDependentModules(): boolean {
      return this.dependentModules().length > 0;
    },
    removeModule() {
      store.commit('removeModuleFromAllSemesters', this.module.id);
      this.updateUrlFragment();
    },
    updateUrlFragment() {
      StorageHelper.updateUrlFragment();
    },
  },
});
</script>

<style scoped>
.module-node {
  width: 240px;
}
</style>

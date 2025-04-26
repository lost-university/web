<template>
  <div
    ref="itemRef"
    :key="module.name + id"
    class="relative module-node"
  >
    <!-- inner flex container: drives the height -->
    <div
      class="rounded-sm group/module p-2 px-8 flex flex-col items-center text-center text-white w-full"
      :class="computedClasses"
    >
      <!-- … your handles, icons, name, ects, etc … -->

      <button
        class="absolute right-2 bottom-2 opacity-0 group-hover/module:opacity-75 hover:opacity-100 transition-opacity duration-75"
        @click="toggleList"
      >
        <font-awesome-icon :icon="['fa','plus-circle']" size="lg"/>
      </button>
    </div>

    <!-- overlay: absolutely positioned on the outer wrapper -->
    <div
      v-if="showList"
      class="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @click.self="toggleList"
    >
      <ModuleList
        :modules="catalog"
        @module-selected="onModuleSelected"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import ModuleList from './GraphModuleList.vue';
import moduleCatalog from '../helpers/temporaryModuleCatalog';
import type { Module } from '../helpers/types';
import { Handle, Position } from '@vue-flow/core';
import { getColorClassForPrioritizedCategory } from '../helpers/color-helper';

export default defineComponent({
  name: 'Module',
  components: { Handle, ModuleList },
  props: {
    module: { type: Object as PropType<Module>, required: true },
    id:     { type: Number, required: true },
  },
  emits: ['on-delete','module-selected'],
  data() {
    return {
      showList: false,
      catalog: moduleCatalog,
      Position
    };
  },
  computed: {
    computedClasses() {
      const classes = [ getColorClassForPrioritizedCategory(this.module.categoriesForColoring) ];
      if (this.module.validationInfo?.severity === 'hard')
        classes.push('border-red-500','border-4');
      return classes;
    }
  },
  methods: {
    toggleList() {
      this.showList = !this.showList;
    },
    onModuleSelected(mod: Module) {
      this.$emit('module-selected', { parentId: this.id, module: mod });
      this.showList = false;
    },
    getElement() {
      return this.$refs.itemRef;
    }
  }
});
</script>

<style scoped>
.module-node {
  width: 240px;
}
</style>

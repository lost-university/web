<template>
  <div
    ref="itemRef"
    :key="module.name + id"
    class="rounded-sm group/module relative p-2 px-8 flex flex-col
           items-center text-center text-white w-full w-[240px]"
    :class="computedClasses"
  >
    <Handle
      type="target"
      :position="Position.Left"
      :style="{ top: '50%', transform: 'translate(0, -50%)', background: '#555', visibility: 'hidden' }"
    />

    <button
      v-if="hasDependent"
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
      v-if="hasRecommended"
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
    >
      {{ module.name }}
    </a>
    <p>{{ module.ects }} ECTS</p>

    <Handle
      type="source"
      :position="Position.Right"
      :style="{ top: '50%', transform: 'translateY(-50%)', background: '#555', visibility: 'hidden' }"
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
      :modules="listSide === 'left' ? recommendedModules : dependentModules"
      @module-selected="onModuleSelected"
      @module-added="hideList"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import ModuleList from './GraphModuleList.vue'
import { getColorClassForPrioritizedCategory } from '../helpers/color-helper'
import { store } from '../helpers/store'
import { StorageHelper } from '../helpers/storage-helper'
import type { Module } from '../helpers/types'

export default defineComponent({
  name: 'GraphModule',
  components: {
    Handle,
    ModuleList
  },
  props: {
    module: {
      type: Object as () => Module,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  emits: ['on-delete', 'module-selected'],
  data() {
    return {
      showList: false,
      listSide: 'left' as 'left' | 'right',
      Position: Position
    }
  },
  computed: {
    computedClasses(): string[] {
      const classes = [getColorClassForPrioritizedCategory(this.module.categoriesForColoring)]
      if (this.module.validationInfo?.severity === 'hard') {
        classes.push('border-red-500', 'border-4')
      }
      return classes
    },
    recommendedModules(): Module[] {
      return this.module.recommendedModuleIds
        .map(id => (store.getters.modules as Module[]).find(m => m.id === id))
        .filter((m): m is Module => !!m && !(store.getters.allPlannedModuleIds as string[]).includes(m.id))
    },
    dependentModules(): Module[] {
      return this.module.dependentModuleIds
        .map(id => (store.getters.modules as Module[]).find(m => m.id === id))
        .filter((m): m is Module => !!m && !(store.getters.allPlannedModuleIds as string[]).includes(m.id))
    },
    hasRecommended(): boolean {
      return this.recommendedModules.length > 0
    },
    hasDependent(): boolean {
      return this.dependentModules.length > 0
    }
  },
  methods: {
    toggleList(side: 'left' | 'right') {
      this.listSide = side
      this.showList = !this.showList
    },
    hideList() {
      this.showList = false
    },
    onModuleSelected(mod: Module) {
      this.$emit('module-selected', { parentId: this.id, module: mod })
      this.showList = false
    },
    removeModule() {
      store.commit('removeModuleFromAllSemesters', this.module.id)
      StorageHelper.updateUrlFragment()
      this.$emit('on-delete')
    }
  }
})
</script>

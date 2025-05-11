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

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import ModuleList from './GraphModuleList.vue'
import { getColorClassForPrioritizedCategory } from '../helpers/color-helper'
import type { Module } from '../helpers/types'
import { store } from '../helpers/store'
import { StorageHelper } from '../helpers/storage-helper'

const props = defineProps<{ module: Module; id: number }>()
const emit = defineEmits<{
  (e: 'on-delete'): void
  (e: 'module-selected', payload: { parentId: number; module: Module }): void
}>()

const showList = ref(false)
const listSide = ref<'left' | 'right'>('left')
const itemRef = ref<HTMLElement>()

const computedClasses = computed<string[]>(() => {
  const classes = [getColorClassForPrioritizedCategory(props.module.categoriesForColoring)]
  if (props.module.validationInfo?.severity === 'hard') {
    classes.push('border-red-500', 'border-4')
  }
  return classes
})

const recommendedModules = computed<Module[]>(() =>
  props.module.recommendedModuleIds
    .map(id => (store.getters.modules as Module[]).find(m => m.id === id))
    .filter((m): m is Module => !!m && !(store.getters.allPlannedModuleIds as string[]).includes(m.id))
)

const dependentModules = computed<Module[]>(() =>
  props.module.dependentModuleIds
    .map(id => (store.getters.modules as Module[]).find(m => m.id === id))
    .filter((m): m is Module => !!m && !(store.getters.allPlannedModuleIds as string[]).includes(m.id))
)

const hasRecommended = computed(() => recommendedModules.value.length > 0)
const hasDependent = computed(() => dependentModules.value.length > 0)

function toggleList(side: 'left' | 'right') {
  listSide.value = side
  showList.value = !showList.value
}

function hideList() {
  showList.value = false
}

function onModuleSelected(mod: Module) {
  emit('module-selected', { parentId: props.id, module: mod })
  showList.value = false
}

function removeModule() {
  store.commit('removeModuleFromAllSemesters', props.module.id)
  StorageHelper.updateUrlFragment()
}
</script>

<style scoped>
.module-node {
  width: 240px;
}
</style>
 
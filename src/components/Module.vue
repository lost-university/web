<template>
  <ModuleCard :module="module" :id="id" @on-delete="$emit('on-delete', module.id)">
    <template #actions>
      <button
        class="absolute opacity-0 touch-only:opacity-75 group-hover/module:opacity-75
               hover:!opacity-100 right-2 transition-opacity duration-75 print:!opacity-0"
        type="button"
        @click="$emit('on-delete', module.id)"
      >
        <font-awesome-icon :icon="['fa', 'circle-xmark']" size="lg" />
      </button>
    </template>
  </ModuleCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ModuleCard from './ModuleCard.vue'
import type { Module } from '../helpers/types'

export default defineComponent({
  name: 'Module',
  components: { ModuleCard },
  props: {
    module: { type: Object as () => Module, required: true },
    id: { type: Number, required: true }
  },
  emits: ['on-delete']
})
</script>

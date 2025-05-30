<template>
  <div
    ref="itemRef"
    :key="module.name + id"
    class="rounded-sm group/module relative p-2 px-8 flex flex-col items-center
           text-center text-white w-[240px]"
    :class="computedClasses"
  >
    <div v-if="showValidation" class="absolute left-2 print:hidden">
      <span
        v-if="module.validationInfo?.severity === 'soft'"
        :title="module.validationInfo.tooltip"
        tabindex="0"
      >
        <font-awesome-icon :icon="['fa', 'info-circle']" />
      </span>
      <span
        v-if="module.validationInfo?.severity === 'hard'"
        :title="module.validationInfo.tooltip"
        tabindex="0"
      >
        <font-awesome-icon :icon="['fa', 'circle-exclamation']" />
      </span>
    </div>

    <slot name="actions" />

    <a
      class="font-bold hover:underline"
      target="_blank"
      :href="'https://studien.ost.ch/' + module.url.replace('.json', '.html')"
    >
      {{ module.name }}
    </a>
    <p>{{ module.ects }} ECTS</p>

    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { getColorClassForPrioritizedCategory } from '../helpers/color-helper'
import type { Module } from '../helpers/types'

export default defineComponent({
  name: 'ModuleCard',
  props: {
    module: {
      type: Object as PropType<Module>,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    showValidation: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    computedClasses(): string[] {
      const classes = [getColorClassForPrioritizedCategory(this.module.categoriesForColoring)]
      if (this.module.validationInfo?.severity === 'hard') {
        classes.push('border-red-500', 'border-4')
      }
      return classes
    }
  },
  methods: {
    getElement() {
      return this.$refs.itemRef
    }
  }
})
</script>

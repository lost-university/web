<template>
  <div
    ref="itemRef"
    :key="module.name + id"
    class="rounded-sm group/module relative p-2 px-8 flex flex-col items-center
           text-center text-white w-[240px]"
    :class="computedClasses"
    :style="{ minHeight: leftColumnMinHeight }"
  >
    <div class="absolute top-1.5 left-1.5 flex flex-col gap-0.5">
      <div
        v-if="hasVisibleValidation"
        class="w-5 h-5 flex items-center justify-center print:hidden"
      >
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

      <span
        v-for="focus in focusesOfModule"
        :key="focus.id"
        class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]"
        :title="focus.name"
        data-cy="module-focus-badge"
        tabindex="0"
      >
        <font-awesome-icon :icon="getIconForFocusId(focus.id)" />
      </span>
    </div>

    <slot name="actions" />

    <a
      class="font-bold hover:underline"
      data-cy="module-name"
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
import { mapGetters } from 'vuex'
import { getColorClassForPrioritizedCategory } from '../helpers/color-helper'
import { getIconForFocusId } from '../helpers/focus-helper'
import type { Focus, Module } from '../helpers/types'

export default defineComponent({
  name: 'ModuleCard',
  props: {
    module: {
      type: Object as PropType<Module>,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    showValidation: {
      type: Boolean,
      default: true
    },
    // keeps the top left column clear of an action button in the bottom left corner
    reserveBottomLeftSpace: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['focuses']),
    focusesOfModule(): Focus[] {
      return (this.focuses as Focus[]).filter(focus => focus.moduleIds.includes(this.module.id))
    },
    hasVisibleValidation(): boolean {
      const severity = this.module.validationInfo?.severity
      return this.showValidation && (severity === 'soft' || severity === 'hard')
    },
    // the top left column is absolutely positioned, so the card has to grow to fit it
    leftColumnMinHeight(): string | undefined {
      const numberOfItems = this.focusesOfModule.length + (this.hasVisibleValidation ? 1 : 0)
      if (!numberOfItems) {
        return undefined
      }
      return `${numberOfItems * 22 + 10 + (this.reserveBottomLeftSpace ? 26 : 0)}px`
    },
    computedClasses(): string[] {
      const classes = [getColorClassForPrioritizedCategory(this.module.categoriesForColoring)]
      if (this.module.validationInfo?.severity === 'hard') {
        classes.push('border-red-500', 'border-4')
      }
      return classes
    }
  },
  methods: {
    getIconForFocusId
  }
})
</script>

<template>
  <div
    ref="itemRef"
    :key="module.name + id"
    class="rounded-sm group/module relative p-2 px-8 flex flex-col items-center text-center text-white w-full module-node"
    :class="computedClasses"
  >
    <Handle
      type="target"
      :position="Position.Left"
      :style="{ top: '50%', transform: 'translate(0, -50%)', background: '#555', visibility: 'hidden'}"
    />
    <div class="absolute left-2">
      <span
        v-if="module.validationInfo && module.validationInfo.severity === 'soft'"
        :title="module.validationInfo.tooltip"
        tabindex="0"
      >
        <font-awesome-icon :icon="['fa', 'info-circle']" />
      </span>
      <span
        v-if="module.validationInfo && module.validationInfo.severity === 'hard'"
        :title="module.validationInfo.tooltip"
        tabindex="0"
      >
        <font-awesome-icon :icon="['fa', 'circle-exclamation']" />
      </span>
    </div>
    
    <button
      class="absolute opacity-0 touch-only:opacity-75 group-hover/module:opacity-75
             hover:!opacity-100 right-2 bottom-2 transition-opacity duration-75"
      type="button"
      @click="$emit('on-add', { id: module.id, side: 'left' })"
    >
      <font-awesome-icon
        :icon="['fa', 'plus-circle']"
        size="lg"
      />
    </button>

    <button
      class="absolute opacity-0 touch-only:opacity-75 group-hover/module:opacity-75
             hover:!opacity-100 left-2 bottom-2 transition-opacity duration-75"
      type="button"
      @click="$emit('on-add', { id: module.id, side: 'left' })"
    >
      <font-awesome-icon
        :icon="['fa', 'plus-circle']"
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
</template>

<script lang="ts">
import {type PropType, defineComponent} from 'vue';
import { Handle, Position } from '@vue-flow/core' 
import { getColorClassForPrioritizedCategory } from '../helpers/color-helper';
import type { Module } from '../helpers/types';

export default defineComponent({
  name: 'Module',
  components: {
    Handle,
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
  emits: ['on-delete'],
  data() {
    return {
      Position
    };
  },
  computed: {
    computedClasses() {
      const classes = [this.getColorClassForPrioritizedCategory(this.module.categoriesForColoring)];
      if(this.module.validationInfo?.severity === 'hard') {
        classes.push(...['border-red-500', 'border-4']);
      }
      return classes;
    }
  },
  methods: {
    getColorClassForPrioritizedCategory,
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
<template>
  <div
    :key="module.name"
    class="rounded group/module relative p-2 flex flex-col items-center text-center text-white w-full"
    :style="{ 'background-color': getCategoryColorForModule(module) }"
  >
    <button
      type="button"
      class="absolute invisible group-hover/module:visible right-0"
      @click="$emit('on-delete', module.id)"
    >Delete</button>
    <a
      class="font-bold hover:underline"
      target="_blank"
      :href="'https://studien.rj.ost.ch/' + module.url.replace('.json', '.html')"
    >{{ module.name }}
    </a>
    <p>{{ module.ects }} ECTS</p>
  </div>
</template>

<script lang="ts">
import { type PropType, defineComponent } from 'vue';
import { getCategoryColorForModule } from '../helpers/color-helper';
import type { Module } from '../helpers/types';

export default defineComponent({
  name: 'Module',
  props: {
    semesterNumber: {
      type: Number,
      required: true,
    },
    module: {
      type: Object as PropType<Module>,
      required: true,
    },
  },
  emits: ['on-delete'],
  methods: {
    getCategoryColorForModule,
  },
});
</script>

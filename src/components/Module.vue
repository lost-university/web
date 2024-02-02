<template>
  <div
    :key="module.name"
    class="column module mt-1"
    :style="{ 'background-color': getCategoryColorForModule(module) }"
  >
    <button
      class="delete-button delete is-pulled-right"
      type="button"
      @click="$emit('on-delete', module.id)"
    />
    <h3 class="has-text-weight-bold">
      <a
        target="_blank"
        :href="'https://studien.rj.ost.ch/' + module.url.replace('.json', '.html')"
      >{{ module.name }}
      </a>
    </h3>
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

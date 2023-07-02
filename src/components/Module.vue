<template>
  <div
    class="column module mt-1"
    :key="module.name"
    :style="{ 'background-color': getCategoryColorForModule(module) }">
    <button class="delete-button delete is-pulled-right" @click="$emit('on-delete', module.id)" type="button" />
    <h3 class="has-text-weight-bold">{{module.name}}</h3>
    <p>{{module.ects}} ECTS</p>
  </div>
</template>

<script lang="ts">
import { type PropType, defineComponent } from 'vue';
import { getCategoryColorForModule } from '../helpers/color-helper';
import type { Module } from '../helpers/types';

export default defineComponent({
  name: 'Module',
  emits: ['on-delete'],
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
  methods: {
    getCategoryColorForModule,
  },
});
</script>

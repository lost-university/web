<template>
  <div
    class="column module mt-1"
    :key="module.name"
    :style="{ 'background-color': this.getCategoryColorForModule(module) }">
    <button type="button" class="delete-button delete is-pulled-right" @click="$emit('on-delete', module.id)" />
    <h3 class="has-text-weight-bold">{{module.name}}</h3>
    <p>{{module.ects}} ECTS</p>
  </div>
</template>

<script>
import { getCategoryColorForModule } from '../helpers/color-helper';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Module',
  emits: ['on-delete'],
  props: {
    semesterNumber: {
      type: Number,
      required: true,
    },
    module: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getCategoryColorForModule,
  },
};
</script>

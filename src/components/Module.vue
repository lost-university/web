<template>
  <div
    class="column module mt-1"
    :key="module.name"
    :style="{ 'background-color': this.getColorForCategory(module.categories[0]) }">
    <button class="delete-button delete is-pulled-right" @click="$emit('on-delete', module.id)">
    </button>
    <h3 class="has-text-weight-bold">{{module.name}}</h3>
    <p>{{module.ects}} ECTS</p>
  </div>
</template>

<script>
import { getColorForCategory } from '../helpers/color-helper';

export default {
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
    getColorForCategory,
  },
};
</script>

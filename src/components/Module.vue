<template>
  <div
    class="column module mt-1"
    :key="module.name"
    :style="{ 'background-color': this.getColorForCategory(module.categories[0]) }">
    <div class="module-header">
      <a class="info-link" v-bind:href="module.url" target="_blank">
        <i class="fa fa-circle-info"></i>
      </a>
      <button class="delete-button delete" @click="$emit('on-delete', module.id)"></button>
    </div>
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

<template>
  <div class="container">
    <p class="ratio-label">{{earned}} / {{required}}</p>
    <p class="planned-label" v-if="planned > 0">{{planned}} noch geplant</p>

    <div class="progress-container">
      <div class="planned-progress" v-bind:style="{ width: plannedProgress }" />
      <div
        class="earned-progress"
        v-bind:style="{
          width: earnedProgress,
          'background-color': color,
        }" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BeautifulProgressIndicator',
  props: {
    required: {
      type: Number,
      required: true,
    },
    earned: {
      type: Number,
      required: true,
    },
    planned: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  computed: {
    earnedProgress() {
      return `${Math.min(100, (100 * this.earned) / this.required)}%`;
    },
    plannedProgress() {
      return `${Math.min(100, (100 * (this.planned + this.earned)) / this.required)}%`;
    },
  },
});
</script>

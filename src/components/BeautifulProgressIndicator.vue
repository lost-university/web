<template>
  <div class="container">
    <p class="ratio-label">
      {{ earned }} / {{ required }}
    </p>
    <p
      v-if="planned > 0"
      class="planned-label"
    >
      {{ planned }} noch geplant
    </p>

    <div class="progress-container">
      <div
        class="planned-progress"
        :style="{ width: plannedProgress }"
      />
      <div
        class="earned-progress"
        :style="{
          width: earnedProgress,
          'background-color': color,
        }"
      />
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
    earnedProgress(): string {
      return `${Math.min(100, (100 * this.earned) / this.required)}%`;
    },
    plannedProgress(): string {
      return `${Math.min(100, (100 * (this.planned + this.earned)) / this.required)}%`;
    },
  },
});
</script>

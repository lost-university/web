<link rel="stylesheet" href="../../styles/main.scss">
<template>
  <div class="text-xs flex justify-between px-1 py-0.5">
    <span>{{ earned }} / {{ required }}</span>
    <span
      v-if="planned > 0"
      class="text-gray-400"
    >
      {{ planned }} noch geplant
    </span>
  </div>

  <div class="bg-gray-200 relative h-5 w-48 rounded-full">
    <div
      class="bg-gray-300 h-full absolute rounded-full transition-all duration-1000"
      :style="{ width: plannedProgress }"
    />
    <div
      class="h-full absolute transition-all duration-1000 rounded-full"
      :class="{ 'opacity-0': earnedProgress == '0%'}"
      :style="{
        width: earnedProgress,
        'background-color': color,
      }"
    />
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

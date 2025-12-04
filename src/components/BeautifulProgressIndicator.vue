<template>
  <div class="bg-gray-200 relative h-5 rounded-full">
    <div
      class="bg-gray-300 h-full absolute rounded-full transition-all duration-300"
      :style="{ width: plannedProgress }"
    />
    <div
      class="h-full absolute transition-all duration-300 rounded-full"
      :class="computedClasses"
      :style="{
        width: earnedProgress
      }"
    />
  </div>
  <div class="text-xs flex justify-between px-1 py-0.5">
    <span>{{ earned }} / {{ required }}</span>
    <font-awesome-icon
      v-if="earned >= required"
      :icon="['fa', 'check']"
    />
    <span
      v-if="earned < required"
      class="text-gray-400"
    >
      {{ toBePlanned }} zu planen
    </span>
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
    colorClass: {
      type: String,
      required: true
    }
  },
  computed: {
    earnedProgress(): string {
      return `${Math.min(100, (100 * this.earned) / this.required)}%`;
    },
    plannedProgress(): string {
      return `${Math.min(100, (100 * (this.planned + this.earned)) / this.required)}%`;
    },
    toBePlanned(): number {
      return Math.max(this.required - this.earned - this.planned, 0);
    },
    computedClasses() {
      const classesObj = { 'opacity-0': this.earnedProgress == '0%' };
      classesObj[this.colorClass] = true;
      return classesObj;
    }
  },
});
</script>

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

<script>
export default {
  name: 'BeautifulProgressIndicator',
  props: {
    required: {
      type: Number,
    },
    earned: {
      type: Number,
    },
    planned: {
      type: Number,
    },
    color: {
      type: String,
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
};
</script>

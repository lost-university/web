<template>
  <div
    class="transition-[filter,opacity] duration-300 ease-in-out"
    :class="[
      (activeHover && !highlightedNodes.has(id)) && 'grayscale opacity-10',
      (!isPlanned) && 'brightness-100 opacity-20'
    ]"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
  >
    <ModuleComponent
      :id="Number(id)"
      :module="moduleData"
    />
  </div>
</template>

<script lang="ts">
import ModuleComponent from './GraphModule.vue';
import { store } from '../helpers/store';
import type { Node } from '@vue-flow/core';

export default {
  name: 'GraphNode',
  components: {
    ModuleComponent,
  },
  props: {
    props: {
      type: Object as () => Node & { data: { moduleData: unknown } },
      required: true,
    },
    activeHover: {
      type: Boolean,
      required: true,
    },
    highlightedNodes: {
      type: Set as () => Set<string>,
      required: true,
    },
  },
  emits: ['hover', 'leave'],
  data() {
    return {
      id: this.props.id,
      moduleData: this.props.data.moduleData,
    };
  },
  computed: {
    isPlanned(): boolean {
      return (store.getters.allPlannedModuleIds as string[]).includes(this.id);
    },
  },
  methods: {
    handleMouseOver() {
      this.$emit('hover', this.id);
    },
    handleMouseLeave() {
      this.$emit('leave');
    },
  },
};
</script>

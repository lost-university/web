<template>
  <button
    class="bg-gray-800 text-white p-1 rounded"
    type="button"
    :class="{ 'collapse h-0': isSearching, ...widthClass }"
    @click="isSearching = true"
  >
    +
  </button>
  <div :class="{ 'collapse h-0': !isSearching }">
    <select
      :id="'modules' + searchId"
      class="w-full bg-pink-100"
      @change="selectModule($event)"
    >
      <option
        value=""
        selected
        disabled
      >
        Choose
      </option>
      <option
        v-for="selectableModule in modules"
        :key="selectableModule.name"
        :value="selectableModule.name"
      >
        {{ selectableModule.name }}
        <span v-if="showNextPossibleSemester && selectableModule.nextPossibleSemester">
          ({{ selectableModule.nextPossibleSemester }})
        </span>
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Module } from '../helpers/types';

export default defineComponent({
  name: 'ModuleSearch',
  props: {
    modules: {
      type: Array<Module>,
      required: true,
    },
    showNextPossibleSemester: {
      type: Boolean,
      required: true
    },
    widthClass: {
      type: Object,
      required: true
    }
  },
  emits: ['on-module-selected'],
  data() {
    return {
      isSearching: false,
      searchId: Math.random(),
    };
  },
  watch: {
    modules: {
      deep: true,
      immediate: false,
      handler() {
        this.isSearching = false;
      },
    },
  },
  methods: {
    selectModule(event: Event) {
      const el = (<HTMLSelectElement>event.currentTarget);
      this.$emit('on-module-selected', el.value);
      el.value = '';
      this.isSearching = false;
    }
  },
});
</script>

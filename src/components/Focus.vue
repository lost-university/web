<template>
  <div
    class="hover:cursor-pointer border border-gray-300 hover:border-gray-600 flex items-center space-x-2 p-2"
    :aria-expanded="isOpen"
    :class="{ 'bg-green-200': !filteredModules.length }"
    type="button"
    @click="toggleFocus()"
  >
    <span class="grow">{{ name }}</span>
    <span
      v-if="filteredModules.length"
      class="shrink-0 text-xs py-1 px-2 rounded bg-blue-50"
    >
      {{ filteredModules.length }} Module werden noch benötigt
    </span>
    <span
      v-if="!filteredModules.length"
      class="shrink-0 text-xs py-1 px-2 rounded bg-green-100"
    >
      Vertiefung geplant
    </span>
    <font-awesome-icon :icon="isOpen ? openIconClass : closedIconClass" />
  </div>
  <div v-show="isOpen" class="p-4 shadow-lg mb-4">
    <p v-if="!filteredModules.length">
      Alle benötigten Module sind bestanden/geplant.
    </p>
    <p v-if="filteredModules.length">
      Für die Vertiefung müssen folgende Module noch geplant werden:
    </p>
    <ul class="list-disc list-inside text-sm mt-1">
      <li
        v-for="module in filteredModules"
        :key="module.id"
      >
        <a
          target="_blank"
          :href="'https://studien.rj.ost.ch/' + module.url.replace('.json', '.html')"
        >{{ module.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Module } from '../helpers/types';

export default defineComponent({
  name: 'Focus',
  props: {
    name: {
      required: true,
      type: String,
      default: '',
    },
    allModules: {
      required: true,
      type: Array<Module>,
      default: () => [],
    },
    filteredModules: {
      required: true,
      type: Array<Module>,
      default: () => [],
    },
  },
  data() {
    return {
      isOpen: false,
      openIconClass: 'chevron-up',
      closedIconClass: 'chevron-down',
    };
  },
  methods: {
    toggleFocus() {
      this.isOpen = !this.isOpen;
    },
  },
});
</script>

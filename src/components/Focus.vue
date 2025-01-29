<template>
  <div
    class="cursor-pointer border border-gray-300 hover:border-gray-600 flex items-center space-x-2 p-2"
    :aria-expanded="isOpen"
    :class="{ 'bg-green-200': numberOfMissingModules == 0 }"
    type="button"
    @click="toggleFocus()"
  >
    <span class="grow">{{ name }}</span>
    <span
      v-if="numberOfMissingModules != 0"
      class="shrink-0 text-xs py-1 px-2 rounded-sm bg-blue-50"
    >
      {{ numberOfMissingModules }} Module werden noch benötigt
    </span>
    <span
      v-if="numberOfMissingModules == 0"
      class="shrink-0 text-xs py-1 px-2 rounded-sm bg-green-100"
    >
      Vertiefung geplant
    </span>
    <font-awesome-icon :icon="isOpen ? openIconClass : closedIconClass" />
  </div>
  <div
    v-show="isOpen"
    class="p-4 shadow-lg mb-4"
  >
    <p v-if="!availableModulesForFocus.length">
      Alle benötigten Module sind bestanden/geplant.
    </p>
    <p v-if="availableModulesForFocus.length">
      Für die Vertiefung können noch folgende Module geplant werden:
    </p>
    <ul class="list-disc list-inside text-sm mt-1">
      <li
        v-for="module in availableModulesForFocus"
        :key="module.id"
        class="h-8 place-content-center"
      >
        <a
          class="hover:underline"
          target="_blank"
          :href="'https://studien.ost.ch/' + module.url.replace('.json', '.html')"
        >{{ module.name }}
        </a>
        <button
          v-if="!!module.nextPossibleSemester"
          class="bg-gray-800 text-white text-xs mx-2 px-2 py-1 rounded-sm"
          type="button"
          @click="$emit('on-add-module-to-next-sem', module.id)"
        >
          + {{ module.nextPossibleSemester.toString() }}
        </button>
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
    availableModulesForFocus: {
      required: true,
      type: Array<Module>,
      default: () => [],
    },
    numberOfMissingModules: {
      required: true,
      type: Number,
    }
  },
  emits: ['on-add-module-to-next-sem'],
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

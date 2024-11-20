<template>
  <!-- eslint-disable-next-line vue/no-mutating-props -->
  <draggable
    class="gap-y-1 flex flex-col items-center"
    :list="modules"
    group="semester"
    item-key="id"
    :animation="200"
    :delay-on-touch-only="true"
    :delay="500"
    @end="onDropEnd"
  >
    <template #header>
      <div class="flex justify-between w-full py-0.5 px-1">
        <span class="text-xl">
          {{ number }}. Semester {{ title }}
        </span>
        <button
          class="opacity-0 touch-only:opacity-25 group-hover/semester:opacity-25 hover:!opacity-75
                 transition-opacity duration-75"
          type="button"
          @click="removeSemester()"
        >
          <font-awesome-icon
            :icon="['fa', 'circle-xmark']"
            size="lg"
          />
        </button>
      </div>
    </template>
    <template #item="{ element }">
      <ModuleComponent
        :module="element"
        :semester-number="number"
        @on-delete="$emit('on-module-deleted', $event)"
      />
    </template>
    <template #footer>
      <ModuleSearch
        :modules="allModules"
        :show-next-possible-semester="false"
        :width-class="{'w-2/3': true}"
        @on-module-selected="(name: string) => addModule(name)"
      />
      <div class="mt-auto p-2">
        <p>{{ getTotalEcts }} ECTS</p>
      </div>
    </template>
  </draggable>
</template>

<script lang="ts">
import draggable from 'vuedraggable';
import ModuleComponent from './Module.vue';
import { defineComponent } from 'vue';
import type { Module } from '../helpers/types';
import ModuleSearch from './ModuleSearch.vue';

export default defineComponent({
  name: 'Semester',
  components: {
    ModuleComponent,
    draggable,
    ModuleSearch,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    modules: {
      type: Array<Module>,
      required: true,
    },
    allModules: {
      type: Array<Module>,
      required: true,
    },
  },
  emits: ['on-module-deleted', 'on-add-module', 'on-remove-semester', 'on-drop-end'],
  computed: {
    getTotalEcts(): number {
      return this.countTotalEcts();
    },
  },
  methods: {
    addModule(name: string) {
      this.$emit('on-add-module', name, this.number);
    },
    removeSemester() {
      this.$emit('on-remove-semester', this.number);
    },
    countTotalEcts(): number {
      return this.modules.reduce((previousValue, module) => previousValue + module.ects, 0);
    },
    onDropEnd() {
      this.$emit('on-drop-end');
    },
  },
});
</script>

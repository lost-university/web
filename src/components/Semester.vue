<template>
  <!-- eslint-disable-next-line vue/no-mutating-props -->
  <draggable
    class="space-y-1 flex flex-col items-center"
    :list="modules"
    group="semester"
    item-key="id"
    :animation="200"
    :delay-on-touch-only="true"
    :delay="500"
    @end="onDropEnd"
  >
    <template #header>
      <div class="flex justify-between">
        <span class="text-xl p-0.5">
          Semester {{ number }}
        </span>
        <button
          class="hidden group-hover/semester:block"
          type="button"
          @click="removeSemester()"
        >Delete</button>
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
      <button
        class="bg-gray-800 text-white w-2/3 py-1 rounded"
        type="button"
        :class="{ 'invisible': isAddingNewModule }"
        @click="isAddingNewModule = true"
      >
        +
      </button>
      <div
        :class="{ 'invisible': !isAddingNewModule }"
      >
        <label for="additionalModule">Select additional module</label>
        <input
          id="additionalModule"
          ref="addModuleInput"
          type="text"
          list="allModules"
          @change="addModule($event)"
        >
        <datalist id="allModules">
          <option
            v-for="selectableModule in allModules"
            :key="selectableModule.name"
            :value="selectableModule.name"
          >
            {{ selectableModule.name }}
          </option>
        </datalist>
      </div>
      <div class="column semester-footer">
        <p>Total ECTS: {{ getTotalEcts }}</p>
      </div>
    </template>
  </draggable>
</template>

<script lang="ts">
import draggable from 'vuedraggable';
import ModuleComponent from './Module.vue';
import { defineComponent, ref } from 'vue';
import type { Module } from '../helpers/types';

export default defineComponent({
  name: 'Semester',
  components: {
    ModuleComponent,
    draggable,
  },
  props: {
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
  data() {
    return {
      isAddingNewModule: false,
    };
  },
  computed: {
    getTotalEcts(): number {
      return this.countTotalEcts();
    },
  },
  watch: {
    modules: {
      deep: true,
      immediate: false,
      handler() {
        this.isAddingNewModule = false;
      },
    },
    isAddingNewModule(newValue: boolean) {
      const addModuleInput = ref<HTMLInputElement | null>(null);
      if (newValue === false) {
        addModuleInput.value?.setAttribute('value', '');
      } else {
        this.$nextTick(() => {
          addModuleInput.value?.focus();
        });
      }
    },
  },
  methods: {
    addModule(event: Event) {
      this.$emit('on-add-module', (<HTMLInputElement>event.currentTarget).value, this.number);
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

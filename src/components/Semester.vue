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
          Semester {{ number }}
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
      <button
        class="bg-gray-800 text-white w-2/3 py-1 rounded"
        type="button"
        :class="{ 'collapse': isAddingNewModule }"
        @click="isAddingNewModule = true"
      >
        +
      </button>
      <div
        :class="{ 'collapse': !isAddingNewModule }"
      >
        <label for="additionalModule">Modulsuche</label>
        <input
          id="additionalModule"
          ref="addModuleInput"
          class="w-full"
          type="text"
          list="allModules"
          @input="addModule($event)"
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
      <div class="mt-auto p-2">
        <p>{{ getTotalEcts }} ECTS</p>
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

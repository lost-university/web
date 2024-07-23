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
          Semester {{ title }}
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
        <label for="categoryFilter">Kategorie</label>
        <select
          id="categoryFilter"
          v-model="selectedCategory"
          class="w-full"
        >
          <option value="">Alle Kategorien</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <label for="additionalModule">Modulsuche</label>
        <input
          id="additionalModule"
          ref="addModuleInput"
          class="w-full"
          type="text"
          list="allModules"
          @input="handleModuleInputEvent($event as InputEvent)"
          @keydown="handleModuleInputKeyDownEvent($event)"
        >
        <datalist id="allModules">
          <option
            v-for="selectableModule in filteredModules"
            :key="selectableModule.name"
            :value="selectableModule.name"
          >
            {{ selectableModule.name }} ({{ selectableModule.category }}) - {{ selectableModule.ects }} ECTS
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
import { defineComponent, ref, computed } from 'vue';
import type { Module, Category } from '../helpers/types';
import { getCategoryColorForModule } from '../helpers/color-helper';

export default defineComponent({
  name: 'Semester',
  components: {
    ModuleComponent,
    draggable,
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
    categories: {
      type: Array<Category>,
      required: true,
    },
  },
  emits: ['on-module-deleted', 'on-add-module', 'on-remove-semester', 'on-drop-end'],
  data() {
    return {
      isAddingNewModule: false,
      selectedCategory: '',
    };
  },
  computed: {
    getTotalEcts(): number {
      return this.countTotalEcts();
    },
    filteredModules(): Module[] {
      if (!this.selectedCategory) {
        return this.allModules;
      }
      return this.allModules.filter(module => module.categories_for_coloring.includes(this.selectedCategory));
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
    handleModuleInputEvent(event: InputEvent) {
      if (event.inputType === 'insertReplacementText') {
        this.addModule(event);
      }
    },
    handleModuleInputKeyDownEvent(event: KeyboardEvent) {
      if (event.key === "Enter") {
        this.addModule(event);
      }
    },
    addModule(event: Event) {
      const name = (<HTMLInputElement> event.currentTarget).value;
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

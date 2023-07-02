<template>
  <!-- eslint-disable-next-line vue/no-mutating-props -->
  <draggable
    :list="modules"
    group="semester"
    item-key="id"
    :animation="200"
    @end="onDropEnd"
    :delayOnTouchOnly="true"
    :delay="500"
    class="columns is-flex is-flex-direction-column has-text-centered">
    <template #header>
      <div class="semester-header">
        <h2 class="subtitle pl-3 mb-2">Semester {{ number }}</h2>
        <button class="delete-button delete is-medium" @click="removeSemester()" type="button" />
      </div>
    </template>
    <template #item="{ element }">
      <ModuleComponent
        @on-delete="$emit('on-module-deleted', $event)"
        :module="element"
        :semesterNumber="number" />
    </template>
    <template #footer>
      <div class="column semester-footer" v-bind:class="{ 'is-hidden': isAddingNewModule }">
        <button class="button is-dark button-add is-fullwidth" @click="isAddingNewModule = true" type="button">
          +
        </button>
      </div>
      <div class="column" v-bind:class="{ 'is-hidden': !isAddingNewModule }">
        <label for="additionalModule">Select additional module</label>
        <input
          id="additionalModule"
          ref="addModuleInput"
          type="text"
          list="allModules"
              @change="addModule($event)">
            <datalist id="allModules">
              <option
                v-for="selectableModule in allModules"
                :key="selectableModule.name"
                v-bind:value="selectableModule.name">
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
import { defineComponent } from 'vue';
import type { Module } from '../helpers/types';

export default defineComponent({
  name: 'Semester',
  emits: ['on-module-deleted', 'on-add-module', 'on-remove-semester'],
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
  components: {
    ModuleComponent,
    draggable,
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
    isAddingNewModule(newValue) {
      // todo: can this be improved?
      if (newValue === false) {
        (<HTMLInputElement>this.$refs.addModuleInput).value = '';
      } else {
        this.$nextTick(() => {
          (<HTMLInputElement>this.$refs.addModuleInput).focus();
        });
      }
    },
  },
  data() {
    return {
      isAddingNewModule: false,
    };
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
      // todo: can this be improved?
      (<{ updateUrlFragment: () => {} }><unknown>this.$parent).updateUrlFragment();
    },
  },
});
</script>

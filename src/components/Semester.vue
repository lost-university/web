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
      <Module
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
          @change="addModule($event.target.value)">
        <datalist id="allModules">
          <option
            v-for="selectableModule in allModules"
            :key="selectableModule.name"
            v-bind:value="selectableModule.name">
            {{selectableModule.name}}
          </option>
        </datalist>
      </div>
      <div class="column semester-footer">
        <p>Total ECTS: {{ getTotalEcts }}</p>
      </div>
    </template>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable';
import Module from './Module.vue';

export default {
  name: 'Semester',
  emits: ['on-module-deleted', 'on-add-module', 'on-remove-semester'],
  props: {
    number: {
      type: Number,
      required: true,
    },
    modules: {
      type: Array,
      required: true,
    },
    allModules: {
      type: Array,
      required: true,
    },
  },
  components: {
    Module,
    draggable,
  },
  computed: {
    getTotalEcts() {
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
      if (newValue === false) {
        this.$refs.addModuleInput.value = null;
      } else {
        this.$nextTick(() => {
          this.$refs.addModuleInput.focus();
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
    addModule(moduleName) {
      this.$emit('on-add-module', moduleName, this.number);
    },
    removeSemester() {
      this.$emit('on-remove-semester', this.number);
    },
    countTotalEcts() {
      return this.modules.reduce((previousValue, module) => previousValue + module.ects, 0);
    },
    onDropEnd() {
      this.$parent.updateUrlFragment();
    },
  },
};
</script>

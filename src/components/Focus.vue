<template>
  <div class="columns is-multiline">
    <button
      @click="toggleFocus()"
      class="button is-fullwidth button-focus"
      :aria-expanded="isOpen"
      :class="{ 'is-success': !filteredModuleNames.length }"
      type="button"
    >
      <div class="focus-main">
        <span>{{ name }}</span>
        <span v-if="filteredModuleNames.length" class="tag is-info is-light">
          {{filteredModuleNames.length}} Module werden noch benötigt
        </span>
        <span v-if="!filteredModuleNames.length" class="tag is-success is-light">
          Vertiefung geplant
        </span>
      </div>
      <div class="focus-aside">
        <span class="icon">
          <font-awesome-icon :icon="isOpen ? openIconClass : closedIconClass" />
        </span>
      </div>
    </button>
    <div v-show="isOpen" class="column is-full column-focus">
      <div class="box box-focus">
        <p v-if="!filteredModuleNames.length">
          Alle benötigten Module sind bestanden/geplant.
        </p>
        <p v-if="filteredModuleNames.length">
          Für die Vertiefung müssen folgende Module noch geplant werden:
        </p>
        <ul class="focus-missing-modules-list">
          <li
            v-for="filteredModuleName in filteredModuleNames"
            :key="filteredModuleName">{{filteredModuleName}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Focus',
  props: {
    name: {
      required: true,
      type: String,
      default: '',
    },
    allModules: {
      required: true,
      type: Array,
      default: () => [],
    },
    filteredModuleNames: {
      required: true,
      type: Array,
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
};
</script>

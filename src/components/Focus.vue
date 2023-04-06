<template>
  <div class="columns is-multiline">
    <button
      @click="toggleFocus()"
      class="button is-fullwidth button-focus"
      :aria-expanded="isOpen"
      :class="{'is-success': !filteredModules.length}"
    >
     <div class="focus-main">
      <span>{{ name }}</span>
        <span v-if="filteredModules.length" class="tag is-info is-light">
          {{filteredModules.length}} Module werden noch benötigt
        </span>
        <span v-if="!filteredModules.length" class="tag is-success is-light">
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
            <p v-if="!filteredModules.length">
              Alle benötigten Module sind bestanden/geplant.
            </p>
            <p v-if="filteredModules.length">
              Für die Vertiefung müssen folgende Module noch geplant werden:
            </p>
            <ul class="focus-missing-modules-list">
              <li v-for="filteredModule in filteredModules"
            :key="filteredModule">{{filteredModule}}</li>
            </ul>

      </div>
    </div>
    </div>
</template>
<script>
export default {
  name: 'Focus',
  props: {
    name: {
      type: String,
    },
    allModules: {
      type: Array,
    },
    filteredModules: {
      type: Array,
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

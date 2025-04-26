You can wrap your v-for in a v-if/v-else to show a fallback when the array is empty. For example:

vue
Kopieren
Bearbeiten
<template>
  <div class="rounded-sm p-2 flex flex-col items-center text-white bg-gray-800 list-node">
    <template v-if="modules.length">
      <div
        v-for="mod in modules"
        :key="mod.id"
        class="m-1 w-full"
      >
        <!-- add `relative group` here -->
        <button
          type="button"
          class="w-full text-left cursor-pointer focus:outline-none relative group"
          @click="addModuleToPlan(mod)"
        >
          <!-- your existing card -->
          <ModuleCard
            v-if="mod?.name"
            :module="mod"
          />

          <div
            class="rounded-sm absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100"
          >
            <span class="text-5xl text-white select-none items-center ">+</span>
          </div>
        </button>
      </div>
    </template>

    <div v-else class="p-2 text-center text-gray-400">
      No modules
    </div>
  </div>
</template>

  <script lang="ts">
  import { defineComponent} from 'vue';
  import type {PropType} from 'vue';
  import ModuleCard from './Module.vue'; // or reuse your Module.vue in a “button” mode
  import { store } from '../helpers/store';
  import { StorageHelper } from '../helpers/storage-helper';

  export default defineComponent({
    name: 'ModuleList',
    components: { ModuleCard },
    props: {
      modules: {
        type: Array as PropType<Module[]>,
        required: true
      }
    },
    emits: ['module-added'],
    methods: {
      addModuleToPlan(module: Module) {
        // find the highest-numbered semester
        const lastSemester = [...store.getters.semesters]
          .sort((a, b) => a.number - b.number)
          .pop()!;

        // pass its number, not the object
        store.commit('addModuleToSemester', {
          semesterNumber: lastSemester.number,
          moduleId: module.id
        });
        this.updateUrlFragment();
        this.$emit('module-added', module);
      },
      updateUrlFragment() {
        StorageHelper.updateUrlFragment();
      },
  },
  });
  </script>
  
  <style scoped>
  .list-node {
    width: 260px; /* a bit wider than a single Module */
    background-color: var(--color-gray-200);
    border: grey;
    z-index: 1000;

  }
  </style>
  



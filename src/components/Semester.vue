<template>
  <draggable
    v-model="modules"
    class="gap-y-1 flex flex-col items-center"
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
          {{ semester.number }}. Semester {{ semester.name }}
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
        :semester="semester"
        @on-delete="$emit('on-module-deleted', $event)"
      />
    </template>
    <template #footer>
      <ModuleSearch
        :show-next-possible-semester="false"
        :button-width-class="'w-2/3'"
        :term-for-which-to-search="term"
        :disable-invalid-modules="!isInPast"
        @on-module-selected="(moduleId) => addModule(moduleId)"
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
import { type PropType, defineComponent } from 'vue';
import type { Module, Semester, Term } from '../helpers/types';
import ModuleSearch from './ModuleSearch.vue';
import { store } from '../helpers/store';
import { SemesterInfo } from '../helpers/semester-info';

export default defineComponent({
  name: 'Semester',
  components: {
    ModuleComponent,
    draggable,
    ModuleSearch,
  },
  props: {
    semester: {
      type: Object as PropType<Semester>,
      required: true
    },
  },
  emits: ['on-module-deleted', 'on-add-module', 'on-remove-semester', 'on-drop-end'],
  computed: {
    getTotalEcts(): number {
      return this.countTotalEcts();
    },
    modules: {
      get() {
        return this.semester.modules;
      },
      set(modules: Module[]) {
        store.commit('setModuleIdsForSemester', {
          semesterNumber: this.semester.number,
          moduleIds: modules.map(m => m.id)
        });
      }
    },
    term(): Term {
      return SemesterInfo.parse(this.semester.name)?.isSpringSemester ? 'FS' : 'HS';
    },
    isInPast(): boolean {
      return SemesterInfo.parse(this.semester.name)?.difference(SemesterInfo.now()) < 0;
    }
  },
  methods: {
    addModule(moduleId: string) {
      this.$emit('on-add-module', moduleId, this.semester.number);
    },
    removeSemester() {
      this.$emit('on-remove-semester', this.semester.number);
    },
    countTotalEcts(): number {
      return this.semester.modules.reduce((previousValue, module) => previousValue + module.ects, 0);
    },
    onDropEnd() {
      this.$emit('on-drop-end');
    },
  },
});
</script>

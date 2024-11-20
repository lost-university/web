<template>
  <table>
    <tbody>
      <tr
        v-for="category in categories"
        :key="category.name"
      >
        <td class="align-bottom pr-4 text-end">
          {{ category.name }}
        </td>
        <td class="pt-3">
          <BeautifulProgressIndicator
            :required="category.requiredEcts"
            :earned="category.earnedCredits"
            :planned="category.plannedCredits"
            :color-class="category.colorClass"
          />
        </td>
        <td class="align-bottom pl-4">
          <div class="w-20">
            <ModuleSearch
              :modules="category.modules"
              :show-next-possible-semester="true"
              :width-class="{'w-10': true}"
              @on-module-selected="(name: string) => addModule(name)"
            />
          </div>
        </td>
      </tr>
      <tr>
        <td class="align-bottom pr-4 text-end">
          Total
        </td>
        <td class="pt-3">
          <BeautifulProgressIndicator
            :required="180"
            :earned="totalEarnedEcts"
            :planned="totalPlannedEcts"
            :color-class="'bg-amber-600'"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Category } from '../helpers/types';
import BeautifulProgressIndicator from './BeautifulProgressIndicator.vue';
import ModuleSearch from './ModuleSearch.vue';

export default defineComponent({
  name: 'Categories',
  components: {BeautifulProgressIndicator, ModuleSearch},
  props: {
    categories: {
      type: Array<Category>,
      required: true,
    },
    totalEarnedEcts: {
      type: Number,
      required: true
    },
    totalPlannedEcts: {
      type: Number,
      required: true
    },
  },
  emits: ['on-add-module'],
  // data() {
  //   return {
  //     isSearching: false,
  //     searchId: Math.random(),
  //   };
  // },
  // watch: {
  //   modules: {
  //     deep: true,
  //     immediate: false,
  //     handler() {
  //       this.isSearching = false;
  //     },
  //   },
  // },
  methods: {
    addModule(name: string) {
      this.$emit('on-add-module', name, this.number);
    },
  },
});
</script>

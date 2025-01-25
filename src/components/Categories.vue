<template>
  <table>
    <tbody>
      <tr
        v-for="category in enrichedCategories"
        :key="category.name"
      >
        <td class="align-bottom pr-4 text-end">
          {{ category.name }}
        </td>
        <td class="pt-3">
          <BeautifulProgressIndicator
            :required="category.requiredEcts"
            :earned="category.earnedEcts"
            :planned="category.plannedEcts"
            :color-class="category.colorClass"
          />
        </td>
        <td class="align-bottom pl-4">
          <ModuleSearch
            :category-id="category.id"
            :show-next-possible-semester="true"
            :button-width-class="'w-10'"
            @on-module-selected="(moduleId) => addModule(moduleId)"
          />
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
import BeautifulProgressIndicator from './BeautifulProgressIndicator.vue';
import ModuleSearch from './ModuleSearch.vue';
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'Categories',
  components: {BeautifulProgressIndicator, ModuleSearch},
  emits: ['on-add-module'],
  computed: {
    ...mapGetters(['enrichedCategories', 'totalPlannedEcts', 'totalEarnedEcts']),
  },
  methods: {
    addModule(moduleId: string) {
      this.$emit('on-add-module', moduleId);
    },
  },
});
</script>

<template>
  <div class="grid grid-cols-[auto_min-content]">
      <template
        v-for="category in enrichedCategories"
        :key="category.name"
      >
        <div class="px-0.5">
          {{ category.name }}
        </div>
        <div class="pl-4 pb-2 row-span-2 self-center">
          <ModuleSearch
            :category-id="category.id"
            :show-next-possible-semester="true"
            :button-width-class="'w-10'"
            @on-module-selected="(moduleId) => addModule(moduleId)"
          />
        </div>
        <div class="pb-4">
          <BeautifulProgressIndicator
            :required="category.requiredEcts"
            :earned="category.earnedEcts"
            :planned="category.plannedEcts"
            :color-class="category.colorClass"
          />
        </div>
      </template>
        <div class="pl-0.5 col-span-2">
          Total
        </div>
        <div>
          <BeautifulProgressIndicator
            :required="180"
            :earned="totalEarnedEcts"
            :planned="totalPlannedEcts"
            :color-class="'bg-amber-600'"
          />
      </div>
  </div>
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

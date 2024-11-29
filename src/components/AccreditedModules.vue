<template>
  <div class="grid grid-cols-[min-content_auto] gap-2">
    <div class="grid grid-rows-2">
      <span>Übertrittsmodule</span>
       <AccreditedModulesModal/>
    </div>
    <div v-if="accreditedModules.length" class="flex flex-wrap">
      <div v-for="accreditedModule in accreditedModules" class="mr-2 mb-2">
        <AccreditedModuleBadge :accredited-module="accreditedModule" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import AccreditedModulesModal from './AccreditedModulesModal.vue';
import AccreditedModuleBadge from './AccreditedModuleBadge.vue';

export default defineComponent({
  name: 'AccreditedModules',
  components: { AccreditedModulesModal, AccreditedModuleBadge },
  computed: {
    ...mapGetters(['accreditedModules']),
  },
  methods: {
    openModal() {

    }
  }
});
</script>

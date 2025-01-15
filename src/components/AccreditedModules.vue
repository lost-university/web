<template>
  <div class="grid grid-cols-[min-content_auto] gap-2">
    <div class="grid grid-rows-2">
      <div class="flex">
        Übertrittsmodule
        <font-awesome-icon
          :icon="['fa', 'circle-question']"
          class="ml-2"
          title="Für im SLCM als 'Übertritt' gekennzeichnete Module"
        />
      </div>
      <AccreditedModulesModal />
    </div>
    <div
      v-if="accreditedModules.length"
      class="flex flex-wrap"
    >
      <div
        v-for="accreditedModule in accreditedModules"
        :key="accreditedModule"
        class="mr-2 mb-2"
      >
        <AccreditedModuleBadge
          :accredited-module="accreditedModule"
          @on-remove-clicked="removeAccreditedModule(accreditedModule)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import AccreditedModulesModal from './AccreditedModulesModal.vue';
import AccreditedModuleBadge from './AccreditedModuleBadge.vue';
import { store } from '../helpers/store';
import { StorageHelper } from '../helpers/storage-helper';
import type { AccreditedModule } from '../helpers/types';

export default defineComponent({
  name: 'AccreditedModules',
  components: { AccreditedModulesModal, AccreditedModuleBadge },
  computed: {
    ...mapGetters(['accreditedModules']),
  },
  methods: {
    removeAccreditedModule(accreditedModule: AccreditedModule) {
      store.commit('removeAccreditedModule', accreditedModule);
      StorageHelper.updateUrlFragment();
    }
  }
});
</script>

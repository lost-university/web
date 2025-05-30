<template>
  <SwitchGroup>
    <div class="flex items-center ml-auto sm:h-8.5">
      <SwitchLabel class="mr-4">Validierung:</SwitchLabel>
      <HeadlessSwitch
        :model-value="validationEnabled"
        :class="validationEnabled ? 'bg-teal-700' : 'bg-gray-500'"
        class="relative inline-flex h-9 w-16 sm:h-6 sm:w-11 items-center rounded-full"
        @update:model-value="toggleValidation"
      >
        <span
          aria-hidden="true"
          :class="validationEnabled ? 'translate-x-9 sm:translate-x-6' : 'translate-x-1'"
          class="inline-block h-6 w-6 sm:h-4 sm:w-4 transform rounded-full bg-white transition"
        />
      </HeadlessSwitch>
    </div>
  </SwitchGroup>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, useStore } from 'vuex';
import { Switch as HeadlessSwitch, SwitchGroup, SwitchLabel } from '@headlessui/vue'
import { StorageHelper } from '../helpers/storage-helper';

export default defineComponent({
  name: 'ValidationSwitch',
  components: {
    SwitchGroup,
    SwitchLabel,
    HeadlessSwitch,
  },
  setup() {
    const store = useStore();

    const toggleValidation = (value: boolean) => {
      store.commit('setValidationEnabled', value);
      StorageHelper.updateUrlFragment();
    };

    return {
      toggleValidation,
    };
  },
  computed: {
    ...mapGetters(['validationEnabled']),
  },
});
</script>

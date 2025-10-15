<template>
  <div class="flex flex-col">
    <template
      v-for="group in groups"
    >
      <Disclosure
        v-if="group.modules.length > 0"
        :key="group.id"
        v-slot="{ open }"
        default-open
      >
        <DisclosureButton
          class="flex w-full justify-between px-4 py-2 text-left text-sm font-medium
          text-white focus:outline-none"
          :class="[group.colorClass, {
            'rounded-t-sm': open,
            'rounded-sm mb-2': !open
          }]"
        >
          <span>{{ group.name }}</span>
          <div class="flex items-center">
            <font-awesome-icon
              :icon="['fa', open ? 'chevron-up' : 'chevron-down']"
              class="h-5 w-5 ml-2"
            />
          </div>
        </DisclosureButton>
        <DisclosurePanel
          class="pb-2 text-sm"
          data-cy="ModuleSearch-ModuleList"
        >
          <ModuleSearchListItem
            v-for="module in group.modules"
            :key="module.id"
            :module="module"
          />
        </DisclosurePanel>
      </Disclosure>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import ModuleSearchListItem from "./ModuleSearchListItem.vue";

export default defineComponent({
  name: "ModuleSearchList",
  components: { ModuleSearchListItem, DisclosurePanel, DisclosureButton, Disclosure },
  props: {
    groups: {
      type: Object,
      required: true
    }
  },
})
</script>

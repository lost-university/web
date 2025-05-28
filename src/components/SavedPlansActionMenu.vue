<template>
  <Menu
    as="div"
    class="relative inline-block text-left"
  >
    <div>
      <MenuButton class="p-2 hover:bg-gray-100 rounded-sm">
        <font-awesome-icon
          :icon="['fas', 'ellipsis']"
        />
      </MenuButton>
    </div>
    <MenuItems
      class="absolute z-10 bg-white shadow-lg rounded-sm"
      :class="menuPositionClass"
    >
      <div class="px-1 py-1">
        <MenuItem
          v-slot="{ close }"
          as="div"
        >
          <button
            class="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
            @click.stop.prevent="sharePlan(close)"
          >
            <font-awesome-icon
              :icon="planCopied ? ['fas', 'check'] : ['fas', 'share-nodes']"
              :class="planCopied ? 'text-green-600' : 'text-black'"
            />
          </button>
        </MenuItem>
      </div>
      <div class="px-1 py-1">
        <MenuItem
          as="div"
        >
          <button
            class="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
            @click="deletePlan()"
          >
            <font-awesome-icon :icon="['fas', 'trash']" />
          </button>
        </MenuItem>
      </div>
    </MenuItems>
  </Menu>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { Plan } from '../types/Plan';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTrash, faCheck, faEllipsis, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faTrash, faCheck, faEllipsis, faShareNodes);

export default defineComponent({
  name: 'SavedPlansActionMenu',
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    FontAwesomeIcon
  },
  props: {
    plan: {
      type: Object as () => Plan,
      required: true
    },
    menuPositionClass: {
      type: String,
      default: 'top-0 left-full ml-1'
    }
  },
  emits: ['delete'],
  setup(props, { emit }) {
    const deletePlan = async () => {
      emit('delete', props.plan.id);
    };
    const planCopied = ref(false);
    return {
      deletePlan,
      planCopied,
    };
  },
  methods: {
    async sharePlan(close: () => void) {
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/#/shared/${this.$props.plan.publicSlug}`;
      try {
        await navigator.clipboard.writeText(shareUrl);
        console.log('Link copied to clipboard:', shareUrl);
        this.planCopied = true;
        setTimeout(() => {
          this.planCopied = false;
          close();
        }, 1000);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    },
  }
});
</script>

<template>
  <Popover
    class="hidden sm:block relative"
  >
    <PopoverButton
      class="mx-2 sm:mx-4 mt-4 mb-2 sm:my-6 text-lg font-bold sm:text-md sm:font-normal"
      data-cy="SavedPlans-Dropdown-Button"
    >
      <span class="mr-2">Gespeicherte Pläne</span>
      <font-awesome-icon
        :icon="['fa', 'chevron-down']"
        class="peer invisible sm:visible"
      />
    </PopoverButton>
    <PopoverPanel
      class="absolute transform rounded-sm sm:shadow-2xl bg-white flex-col sm:fixed z-50"
    >
      <ul>
        <li
          v-for="plan in modulePlans"
          :key="plan.id"
          class="flex items-center justify-between"
          data-cy="SavedPlans-List-Item"
        >
          <router-link
            :to="{ path: plan.content, query: $route.query }"
            class="p-2 hover:bg-gray-100 rounded-sm flex-grow"
          >
            {{ plan.name }}
          </router-link>
          <Menu
            as="div"
            class="relative inline-block text-left"
          >
            <div>
              <MenuButton
                class="p-2 hover:bg-gray-100 rounded-sm"
              >
                <font-awesome-icon
                  :icon="['fas', 'ellipsis']"
                  class="w-4 h-4"
                />
              </MenuButton>
            </div>
            <MenuItems
              class="absolute top-0 left-full ml-1 bg-white shadow-lg rounded-sm z-10"
            >
              <div class="px-1 py-1">
                <MenuItem
                  v-slot="{ close }"
                  as="div"
                >
                  <button
                    class="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                    @click.stop.prevent="sharePlan(plan.id, close)"
                  >
                    <font-awesome-icon
                      :icon="copiedPlanId === plan.id ? ['fas', 'check'] : ['fas', 'share-nodes']"
                      :class="copiedPlanId === plan.id ? 'text-green-600' : 'text-black'"
                    />
                  </button>
                </MenuItem>
              </div>
              <div class="px-1 py-1">
                <MenuItem>
                  <button
                    class="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                    @click="deletePlan(plan.id)"
                  >
                    <font-awesome-icon
                      :icon="['fas', 'trash']"
                    />
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </li>
      </ul>
      <form
        class="flex items-center justify-between"
        @submit.prevent="savePlan"
      >
        <input
          v-if="isEditingName"
          v-model="planName"
          type="text"
          class="p-2 hover:bg-gray-100 rounded-sm"
          placeholder="Plan Namen eingeben"
          data-cy="SavePlan-Name"
        >
        <button
          v-if="isEditingName"
          type="submit"
          data-cy="SavePlan-Submit"
        >
          Erstellen
        </button>
      </form>
      <button
        v-if="!isEditingName"
        class="p-2 hover:bg-gray-100 rounded-sm text-left"
        data-cy="SavePlan-Button"
        @click="() => isEditingName = !isEditingName"
      >
        + Aktuellen Plan speichern
      </button>
    </PopoverPanel>
  </Popover>

  <div class="flex flex-col sm:hidden">
    <span
      class="mx-2 mt-2 text-lg font-bold sm:text-md sm:font-normal"
      data-cy="SavedPlans-Title-Mobile"
    >
      Gespeicherte Pläne
    </span>
    <ul>
      <li
        v-for="plan in modulePlans"
        :key="plan.id"
        class="flex items-center justify-between"
        data-cy="SavedPlans-List-Item"
      >
        <router-link
          :to="{ path: plan.content, query: $route.query }"
          class="p-2 hover:bg-gray-100 rounded-sm"
        >
          {{ plan.name }}
        </router-link>
        <Menu
          as="div"
          class="relative inline-block text-left"
        >
          <div>
            <MenuButton
              class="p-2 hover:bg-gray-100 rounded-sm"
            >
              <font-awesome-icon
                :icon="['fas', 'ellipsis']"
                class="w-4 h-4"
              />
            </MenuButton>
          </div>
          <MenuItems
            class="absolute right-0 mt-1 bg-white shadow-lg rounded-sm z-10"
          >
            <div class="px-1 py-1">
              <MenuItem
                v-slot="{ close }"
                as="div"
              >
                <button
                  class="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                  @click.stop.prevent="sharePlan(plan.id, close)"
                >
                  <font-awesome-icon
                    :icon="copiedPlanId === plan.id ? ['fas', 'check'] : ['fas', 'share-nodes']"
                    :class="copiedPlanId === plan.id ? 'text-green-600' : 'text-black'"
                  />
                </button>
              </MenuItem>
            </div>
            <div class="px-1 py-1">
              <MenuItem>
                <button
                  class="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                  @click="deletePlan(plan.id)"
                >
                  <font-awesome-icon
                    :icon="['fas', 'trash']"
                  />
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </li>
    </ul>
    <form
      class="flex items-center justify-between"
      @submit.prevent="savePlan"
    >
      <input
        v-if="isEditingName"
        v-model="planName"
        type="text"
        class="p-2 hover:bg-gray-100 rounded-sm"
        placeholder="Plan Namen eingeben"
        data-cy="SavePlan-Name"
      >
      <button
        v-if="isEditingName"
        type="submit"
        data-cy="SavePlan-Submit"
      >
        Erstellen
      </button>
    </form>
    <button
      v-if="!isEditingName"
      class="p-2 hover:bg-gray-100 rounded-sm text-left"
      data-cy="SavePlan-Button"
      @click="() => isEditingName = !isEditingName"
    >
      + Aktuellen Plan speichern
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuth } from "@clerk/vue";
import { fetchSavedPlans, savePlan, deletePlan } from "../api/plan";
import type { Plan } from "../types/Plan";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem
} from '@headlessui/vue';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTrash,
  faShareNodes,
  faCheck,
  faChevronDown,
  faEllipsis
} from '@fortawesome/free-solid-svg-icons';

library.add(faTrash, faShareNodes, faCheck, faChevronDown, faEllipsis);

export default defineComponent({
  name: 'SavedPlans',
  components: {
    Popover,
    PopoverButton,
    PopoverPanel,
    // eslint-disable-next-line vue/no-reserved-component-names
    Menu,
    MenuButton,
    // eslint-disable-next-line vue/no-reserved-component-names
    MenuItems,
    // eslint-disable-next-line vue/no-reserved-component-names
    MenuItem,
    FontAwesomeIcon
  },
  setup() {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const copiedPlanId = ref<string | null>(null);
    return {
      getToken,
      isLoaded,
      isSignedIn,
      copiedPlanId,
    };
  },
  data() {
    return {
      modulePlans: [] as Plan[],
      isEditingName: false,
      planName: '',
    }
  },
  computed: {
    isClerkReady() {
      return this.isLoaded && this.isSignedIn;
    }
  },
  watch: {
    isClerkReady: {
      async handler(newValue) {
        if (newValue) {
          await this.getPlans();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async getPlans() {
      const token = await this.getToken() as string;
      this.modulePlans = await fetchSavedPlans(token);
    },
    async savePlan() {
      const token = await this.getToken() as string;
      await savePlan(this.planName, this.$route.path.replace('/plan/', ''), token);
      this.isEditingName = false;
      this.planName = '';
      await this.getPlans();
    },
    async deletePlan(planId: string) {
      const token = await this.getToken() as string;
      await deletePlan(planId, token)
      await this.getPlans();
    },
    async sharePlan(planId: string, close: () => void) {
      const plan = this.modulePlans.find(p => p.id === planId);
      if (!plan || !plan.publicSlug) {
        console.error('No public_slug found for this plan');
        return;
      }

      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/#/shared/${plan.publicSlug}`;
      try {
        await navigator.clipboard.writeText(shareUrl);
        console.log('Link copied to clipboard:', shareUrl);
        this.copiedPlanId = planId;
        setTimeout(() => {
          this.copiedPlanId = null;
          close();
        }, 1000);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    },
  },
})
</script>

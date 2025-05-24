<template>
  <div>
    <div class="px-2 sm:px-4 pt-4 pb-2 sm:py-6 peer">
      <button
        class="hover:cursor-auto mr-2 text-lg font-bold sm:text-md sm:font-normal"
        data-cy="SavedPlans-Dropdown-Button"
      >
        Gespeicherte Pläne
      </button>
      <font-awesome-icon
        :icon="['fa', 'chevron-down']"
        class="peer invisible sm:visible"
      />
    </div>
    <div
      class="sm:hidden peer-hover:flex hover:flex flex rounded-sm sm:shadow-2xl bg-white flex-col sm:fixed z-50"
    >
      <ul>
        <li
          v-for="plan in modulePlans"
          :key="plan.id"
          class="relative flex items-center justify-between"
          data-cy="SavedPlans-List-Item"
        >
          <router-link
            :to="plan.content"
            class="p-2 hover:bg-gray-100 rounded-sm"
          >
            {{ plan.name }}
          </router-link>
          <div
            class="relative"
            @mouseenter="activePlanId = plan.id"
            @mouseleave="activePlanId = null"
          >
            <div class="p-2 hover:bg-gray-100 rounded-sm">
              <font-awesome-icon
                :icon="['fas', 'ellipsis-vertical']"
                class="w-4 h-4"
              />
            </div>
            <div
              v-if="activePlanId === plan.id"
              class="absolute top-0 left-full mt-1 bg-white shadow-lg rounded-sm z-10"
            >
              <button
                class="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                @click="sharePlan(plan.id)"
              >
                <font-awesome-icon
                  :icon="copiedPlanId === plan.id ? ['fas', 'check'] : ['fas', 'share']"
                  :class="copiedPlanId === plan.id ? 'text-green-600' : 'text-black'"
                />
                <span class="sr-only">Teilen</span>
              </button>
              <button
                class="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                @click="deletePlan(plan.id)"
              >
                <font-awesome-icon
                  :icon="['fas', 'trash']"
                />
                <span class="sr-only">Löschen</span>
              </button>
            </div>
          </div>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuth } from "@clerk/vue";
import { type Plan, PlanStore } from "../helpers/plan-store";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faShare, faCheck, faChevronDown, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

library.add(faTrash, faShare, faCheck, faChevronDown, faEllipsisVertical);

export default defineComponent({
  name: 'SavedPlans',
  components: { FontAwesomeIcon },
  setup() {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const activePlanId = ref<string | null>(null);
    const copiedPlanId = ref<string | null>(null);
    return {
      getToken,
      isLoaded,
      isSignedIn,
      activePlanId,
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
      async handler(newValue, oldValue) {
        console.log(newValue, oldValue);
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
      try {
        const token = await this.getToken() as string;
        this.modulePlans = await new PlanStore().fetchSavedPlans(token);
      } catch (error) {
        console.error('Error fetching plans: ', error)
      }
    },
    async savePlan() {
      const token = await this.getToken() as string;
      await new PlanStore().savePlan(this.planName, this.$route.path.replace('/plan/', ''), token);
      this.isEditingName = false;
      this.planName = '';
      await this.getPlans();
    },
    async deletePlan(planId: string) {
      const token = await this.getToken() as string;
      await new PlanStore().deletePlan(planId, token)
      await this.getPlans();
    },
    async sharePlan(planId: string) {
      const plan = this.modulePlans.find(p => p.id === planId);
      if (!plan || !plan.public_slug) {
        console.error('No public_slug found for this plan');
        return;
      }

      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/#/shared/${plan.public_slug}`;
      try {
        await navigator.clipboard.writeText(shareUrl);
        console.log('Link copied to clipboard:', shareUrl);
        this.copiedPlanId = planId;
        // Reset after 2 seconds
        setTimeout(() => {
          this.copiedPlanId = null;
        }, 2000);
        // Optionally show a toast or notification here
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    },
  },
})
</script>

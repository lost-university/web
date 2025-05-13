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
          class="flex items-center justify-between"
          data-cy="SavedPlans-List-Item"
        >
          <router-link
            :to="plan.content"
            class="p-2 hover:bg-gray-100 rounded-sm"
          >
            {{ plan.name }}
          </router-link>
          <button
            class="p-2 hover:bg-gray-100 rounded-sm"
            data-cy="SavedPlans-Delete-Button"
            @click="deletePlan(plan.id)"
          >
            Löschen
          </button>
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
import { defineComponent } from 'vue';
import { useAuth } from "@clerk/vue";
import { type Plan, PlanStore } from "../helpers/plan-store";

export default defineComponent({
  name: 'SavedPlans',
  setup() {
    const { getToken, isLoaded, isSignedIn } = useAuth();

    return {
      getToken,
      isLoaded,
      isSignedIn,
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
  },
})
</script>

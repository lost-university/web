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
      class="absolute transform rounded-sm sm:shadow-2xl bg-white dark:bg-zinc-800 flex-col sm:fixed z-50"
    >
      <ul>
        <li
          v-for="plan in modulePlans"
          :key="plan.id"
          class="flex items-center justify-between"
          data-cy="SavedPlans-List-Item"
        >
          <button
            class="p-2 hover:bg-gray-100 rounded-sm"
            data-cy="SavedPlans-Bookmark-Button"
            @click="bookmarkPlan(plan.id)"
          > 
            <font-awesome-icon :icon="[plan.bookmark ? 'fas' : 'far', 'bookmark']" />
          </button>
          <router-link
            :to="plan.content"
            class="p-2 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-sm flex-auto"
          >
            {{ plan.name }}
          </router-link>
          <button
            class="p-2 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-sm"
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
          class="p-2 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-sm flex-auto"
          placeholder="Plan Namen eingeben"
          data-cy="SavePlan-Name"
        >
        <button
          v-if="isEditingName"
          type="submit"
          class="p-2 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-sm"
          data-cy="SavePlan-Submit"
        >
          Erstellen
        </button>
      </form>
      <button
        v-if="!isEditingName"
        class="p-2 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-sm text-left"
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
          :to="plan.content"
          class="p-2 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-sm flex-auto"
        >
          {{ plan.name }}
        </router-link>
        <button
          class="p-2 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-sm"
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
        class="p-2 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-sm flex-auto"
        placeholder="Plan Namen eingeben"
        data-cy="SavePlan-Name"
      >
      <button
        v-if="isEditingName"
        type="submit"
        class="p-2 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-sm"
        data-cy="SavePlan-Submit"
      >
        Erstellen
      </button>
    </form>
    <button
      v-if="!isEditingName"
      class="p-2 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-sm text-left"
      data-cy="SavePlan-Button"
      @click="() => isEditingName = !isEditingName"
    >
      + Aktuellen Plan speichern
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuth } from "@clerk/vue";
import { fetchSavedPlans, savePlan, deletePlan, bookmarkPlan } from "../api/plan";
import type { Plan } from "../types/Plan";
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

library.add(faChevronDown);

export default defineComponent({
  name: 'SavedPlans',
  components: {
    Popover,
    PopoverButton,
    PopoverPanel,
    FontAwesomeIcon
  },
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
  watch: {
    isSignedIn: {
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
      let plan = this.$route.path.replace('/plan/', '') + "?" + new URLSearchParams(this.$route.query).toString();
      await savePlan(this.planName, plan, token);
      this.isEditingName = false;
      this.planName = '';
      await this.getPlans();
    },
    async deletePlan(planId: string) {
      const token = await this.getToken() as string;
      await deletePlan(planId, token)
      await this.getPlans();
    },
    async bookmarkPlan(planId: string){
      const token = await this.getToken() as string;
      await bookmarkPlan(planId, token)
      // await this.getPlans();
    }
  },
})
</script>

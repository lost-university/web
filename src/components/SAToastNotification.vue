<template>
  <transition
    enter-active-class="duration-500 ease"
    enter-from-class="transform opacity-0"
    leave-active-class="duration-500 ease"
    leave-to-class="transform opacity-0"
  >
    <div
      v-if="isActive"
      class="rounded p-4 mb-2 bg-pink-600 text-white"
    >
      <p><b>Gestalte den Planer von morgen mit!</b></p>
      <span v-if="!isExpanded">Wir suchen Teilnehmer für eine UX-Studie im Rahmen unserer SA zum Planer.</span>
      <span v-if="isExpanded">
        Für unsere SA suchen wir Teilnehmende für Interviews, Umfragen oder Tagebuchstudien.
        Interesse? Melde dich bei uns!
        Danke, Stefi &amp; Laura
      </span>
      <button
        class="absolute right-2 top-2"
        type="button"
        @click="dismiss()"
      >
        <font-awesome-icon
          :icon="['fa', 'circle-xmark']"
          size="lg"
        />
      </button>
      <button
        v-if="!isExpanded"
        class="block rounded bg-slate-200/50 py-1 px-2 mt-2 hover:bg-slate-300/50 transition-colors duration-75"
        type="button"
        @click="toggleExpand()"
      >
        Mehr
      </button>
      <button
        v-if="isExpanded"
        class="block rounded bg-slate-200/50 py-1 px-2 mt-2 hover:bg-slate-300/50 transition-colors duration-75"
        type="button"
        @click="participate()"
      >
        Teilnehmen
      </button>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const SA_TOAST_DISMISSED_KEY = 'sa_toast_dismissed';

export default defineComponent({
  name: 'SAToastNotification',
  data() {
    return {
      isActive: false,
      isExpanded: false,
    }
  },
  async mounted() {
    const saToastDismissed = localStorage.getItem(SA_TOAST_DISMISSED_KEY);
    this.isActive = !saToastDismissed;
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },
    dismiss() {
      localStorage.setItem(SA_TOAST_DISMISSED_KEY, `${true}`);
      this.isActive = false;
    },
    participate() {
      /* eslint-disable-next-line max-len */
      window.open("https://teams.microsoft.com/l/team/19%3A6zuS6jbWX4asXCCg1QzZbuFL4SC9prIAPL4haU5_bLg1%40thread.tacv2/conversations?groupId=3740cce2-50c5-4f44-9211-21f735b6c827&tenantId=a6e70fa3-1c7a-4aa2-a25e-836eea52ca22");
    }
  }
});

</script>

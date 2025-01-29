<template>
  <hr class="border-gray-200">
  <footer class="flex items-center p-4 justify-between">
    <div class="text-sm">
      <span>© 2025 </span>
      <span
        v-for="(contributor, index) in contributors"
        :key="contributor.githubHandle"
      >
        <a
          :href="'https://github.com/' + contributor.githubHandle"
          class="hover:text-purple-800"
          target="_blank"
          rel="noopener noreferrer"
        >{{ contributor.name }}</a>
        <span>{{ index != contributors.length - 1 ? ', ' : '' }}</span>
      </span>
    </div>
    <a
      class="hover:text-purple-800"
      href="https://github.com/lost-university"
    >
      <font-awesome-icon
        :icon="['fab', 'github']"
        size="2x"
      />
    </a>
  </footer>
  <div class="bg-[#8c195f] text-white text-center p-4 space-y-1">
    <div class="font-bold">
      Die Webseite wurde kürzlich im Rahmen einer SA überarbeitet und hat jetzt ein paar neue Features
    </div>
    <div class="text-sm">
      Falls etwas nicht funktionieren sollte, eröffne bitte ein Issue
      <a href="https://github.com/lost-university/web/issues/new/choose"><u>auf GitHub.</u></a>
      Die vorherige Version ist unter <a href="https://old.lost.university"><u>old.lost.university</u></a>
      weiterhin für eine begrenzte Zeit verfügbar.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Contributor } from "../helpers/types";

export default defineComponent({
  name: 'PageFooter',
  props: {
    contributors: {
      type: Array<Contributor>,
      default: () => [
        { name: "Jeremy Stucki", githubHandle: "jeremystucki" },
        { name: "Gregor Stuber", githubHandle: "unkelhoebbi" },
        { name: "Joshua Hürzeler", githubHandle: "joshuabeny1999" },
        { name: "Mathias Fischler", githubHandle: "Mafii" },
        { name: "Luzia Kündig", githubHandle: "lzkndg" },
        { name: "Stefanie Jäger", githubHandle: "StefanieJaeger" },
        { name: "Vina Zahnd", githubHandle: "Venyla" },
        { name: "Linus Flury", githubHandle: "CHLinusch" },
        { name: "Marco Schneider", githubHandle: "marcoschneider" },
        { name: "Jan Untersander", githubHandle: "Untersander" },
        { name: "Laura Thoma", githubHandle: "captainwuushuu" }
      ],
    },
  },
});
</script>

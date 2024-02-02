<template>
  <Navigation />
  <div class="p-2 bg-gray-400">
    <router-view />
  </div>
  <PageFooter />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navigation from './components/Navigation.vue';
import PageFooter from './components/PageFooter.vue';

export default defineComponent({
  components: {
    PageFooter,
    Navigation,
  },
});
</script>

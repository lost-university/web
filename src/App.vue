<template>
  <Navigation />
  <div class="p-5 custom-container">
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

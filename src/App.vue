<template>
  <div>
    <Navigation />
    <router-view />
    <PageFooter />
  </div>
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

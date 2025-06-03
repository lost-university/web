<template>
  <div>Loading...</div>
</template>

<script lang="ts">
import { fetchSharedPlan } from "../api/plan";

export default {
  async mounted() {
    const path = await fetchSharedPlan(this.$route.params.slug);
    await this.$router.replace({ path: path });
  },
};
</script>

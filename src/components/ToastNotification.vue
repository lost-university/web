<template>
  <transition
    enter-active-class="duration-500 ease"
    enter-from-class="transform opacity-0"
    leave-active-class="duration-500 ease"
    leave-to-class="transform opacity-0">
    <div v-if="isActive" class="rounded p-4 mb-2 bg-red-500 text-white">
      <span>{{ text }}</span>
      <ul v-if="listItems?.length">
        <li v-for="item in listItems">{{ item }}</li>
      </ul>
      <button
        class="block rounded bg-slate-200/50 py-1 px-2 mt-2"
        type="button"
          v-if="dismissButtonText"
          @click="$emit('on-dismiss')">
          {{ dismissButtonText }}
      </button>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ToastNotification',
  props: {
    duration: {
      type: Number,
      default: 0
    },
    text: {
      type: String,
      required: true,
    },
    listItems: {
      type: Array<String>,
      default: () => [],
    },
    dismissButtonText: {
      type: String,
    },
    showToast: {
      type: Boolean
    }
  },
  emits: ['on-dismiss'],
  data() {
    return {
      isActive: false
    }
  },
  watch: {
    showToast: {
      handler() {
      this.isActive = this.showToast;
      if (this.duration != 0) {
        setTimeout(() => {
          this.isActive = false;
        }, this.duration);
      }
    }
    }
  },
});

</script>

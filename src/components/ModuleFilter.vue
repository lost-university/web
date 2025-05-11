<template>
  <span
    :class="{
      'isolate rounded-sm inline-flex shadow-sm': isButtonGroup,
      'flex flex-col gap-1': !isButtonGroup,
    }"
    :data-cy="dataCyTag"
  >
    <button
      v-for="item in data"
      :key="item.id"
      type="button"
      class="relative inline-flex px-3 py-2 focus:z-10"
      :class="[classes(item), item.color]"
      :data-cy="`${dataCyTag}-Item`"
      @click="onclick(item.id)"
    >
      <span :class="{'underline': selected.includes(item.id)}">
        {{ item.value }}
      </span>
    </button>
  </span>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { ModuleFilter } from "../types/ModuleFilter";

export default defineComponent({
  name: "ModuleFilter",
  props: {
    data: {
      type: Array as PropType<Array<ModuleFilter>>,
      required: true
    },
    selected: {
      type: Array as PropType<Array<number | string>>,
      required: true
    },
    isSingleSelect: {
      type: Boolean,
      default: false
    },
    isButtonGroup: {
      type: Boolean,
      default: false
    },
    dataCyTag: {
      type: String,
      default: 'ModuleFilter'
    },
  },
  emits: ['update:selected'],
  methods: {
    classes(item: ModuleFilter) {
      return {
        'hover:bg-gray-50 ring-1 ring-inset ring-gray-300': this.isButtonGroup,
        'first:rounded-l-sm not-first:relative not-first:-ml-px': this.isButtonGroup,
        'last:relative last:-ml-px last:rounded-r-sm': this.isButtonGroup,
        'bg-white': this.selected.includes(item.id) && this.isButtonGroup,
        'bg-gray-200 text-gray-500': !this.selected.includes(item.id) && this.selected.length > 0 && this.isButtonGroup,
        'opacity-60 text-black': !this.selected.includes(item.id) && this.selected.length > 0 && !this.isButtonGroup,
        'rounded-sm text-white': !this.isButtonGroup,
      }
    },
    onclick(id: number | string) {
      if (this.isSingleSelect) {
        this.$emit('update:selected', this.selected.includes(id) ? [] : [id])
      } else {
        const index = this.selected.indexOf(id)
        const newSelection = [...this.selected]

        if (index > -1) {
          newSelection.splice(index, 1)
        } else {
          newSelection.push(id)
        }
        this.$emit('update:selected', newSelection)
      }
    }
  },
})
</script>

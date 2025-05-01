<template>
  <span
    class=""
    :class="{
      'isolate rounded-sm inline-flex shadow-sm': isButtonGroup,
      'flex flex-col gap-1': !isButtonGroup,
    }"
  >
    <button
      v-for="(item, index) in data"
      :key="item.id"
      type="button"
      class="relative inline-flex px-3 py-2 focus:z-10"
      :class="[classes(item, index), item.color]"
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

export default defineComponent({
  name: "ModuleFilter",
  props: {
    data: {
      type: Array as PropType<Array<{ id: number | string; value: string, color?: string }>>,
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
    }
  },
  emits: ['update:selected'],
  methods: {
    classes(item, index) {
      return {
        'hover:bg-gray-50 ring-1 ring-inset ring-gray-300': this.isButtonGroup,
        'rounded-l-sm': index === 0 && this.isButtonGroup,
        'relative -ml-px rounded-r-sm': index === this.data.length - 1 && this.isButtonGroup,
        'relative -ml-px': index !== 0 && this.isButtonGroup,
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

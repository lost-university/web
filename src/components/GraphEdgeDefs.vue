<template>
  <svg style="position: absolute; width: 0; height: 0;">
    <defs>
      <linearGradient
        v-for="edge in edges"
        :id="edge.gradientId"
        :key="edge.id"
        x1="0%"
        y1="0%"
        x2="100%" 
        y2="0%"
      >
        <stop 
          offset="0%"
          :stop-color="edge.sourceColor"
        />
        <stop
          offset="100%"
          :stop-color="edge.targetColor"
        />
        
      </linearGradient>
      <marker
        markerWidth="10"
        markerHeight="100"
        refX="0" 
        refY="5"
        orient="auto"
      >
        <path d="M0,0 L0,10 L10,5 Z" />
      </marker>
    </defs>
  </svg>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import type { PropType } from 'vue';
  import type { Edge as VueFlowEdge } from '@vue-flow/core';

  export type GraphEdge = VueFlowEdge & {
    gradientId: string;
    sourceColor: string;
    targetColor: string;
  };

  export default defineComponent({
    name: 'EdgeDefs',
      props: {
        edges: {
        type: Array as PropType<GraphEdge[]>,
        required: true,
      },
    },
  });
</script>
  
<template>
  <div class="cy-wrapper">
    <div id="cy"></div>
  </div>
</template>

<style>
.cy-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
}

#cy {
  width: 100%;
  height: 100%;
  position: relative;
  margin: auto;
  background: #ececec;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Module } from '../../helpers/types';
import cytoscape from 'cytoscape';
import { getCategoryColorForModule } from '../../helpers/color-helper';

export default defineComponent({
  name: 'ModuleDependencyGraph',
  props: {
    modulesToDisplay: {
      type: Array<Module>,
      required: true,
    },
    selectedModules: {
      type: Array<Module>,
      required: true,
    },
  },
  data() {
    return {
      cy: null as any | null,
    }
  },
  mounted() {
    this.create();
  },
  watch: {
    modulesToDisplay: {
      deep: true,
      immediate: false,
      handler() {
        this.create();
      },
    },
  },
  methods: {
    buildData(): { nodes: {  data: Node }[], edges:  { data: Edge }[] } {
      const nodes: { data: Node }[] = [...this.modulesToDisplay.map(module => ({
        data: {
          id: module.id,
          label: module.name,
          categoryColor: getCategoryColorForModule(module),
        }
      }))];
      let edges = [...this.modulesToDisplay.flatMap(module =>
        module.recommendedModuleIds.map(recId =>
          ({ data: { source: recId, target: module.id } })
        ) ?? [])];
      edges = edges.filter(edge =>
        edge.data.source &&
        edge.data.target &&
        nodes.some(node => node.data.id === edge.data.source) &&
        nodes.some(node => node.data.id === edge.data.target));

      console.log({ nodes, edges });
      return { nodes, edges };
    },
    create() {
      const { nodes, edges } = this.buildData();

      this.cy = cytoscape({
        container: document.getElementById('cy'),
        elements: {
          nodes,
          edges
        },
        zoomingEnabled: false,
        style: [
          {
            selector: "node[label]",
            style: {
              "label": "data(label)",
            }
          },
          {
            selector: "edge[label]",
            style: {
              "label": "data(label)",
              "width": 3
            }
          },
          {
            selector: "edge",
            style: {
              "width": 1,
              "target-arrow-shape": "triangle",
              "curve-style": "straight",
            }
          },
          {
            selector: 'node[categoryColor]',
            style: {
              "background-color": "data(categoryColor)"
            }
          }
        ],
      });
    }
  },
});

type Node = {
  id: string,
  label: string,
  categoryColor: string,
};

type Edge = {
  source: string,
  target: string,
};

</script>

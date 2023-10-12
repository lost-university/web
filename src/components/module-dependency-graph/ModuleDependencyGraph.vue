<template>
  <canvas id="chart" />
</template>

<script lang="ts">
import { Chart, LinearScale, PointElement } from 'chart.js/auto';
import { defineComponent } from 'vue';
import { ForceDirectedGraphController, EdgeLine } from 'chartjs-chart-graph';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { Module } from '../../helpers/types';

type Node = { id: string, displayName: string };
type Link = { source: string, target: string };

Chart.register(ForceDirectedGraphController, EdgeLine, LinearScale, PointElement, ChartDataLabels);

export default defineComponent({
  name: 'ModuleDependencyGraph',
  props: {
    modules: {
      type: Array<Module>,
      required: true,
    },
  },
  watch: {
    modules: {
      deep: true,
      immediate: false,
      handler() {
        const nodes = this.modules.map(module => ({ id: module.id, displayName: module.name }));
        const links = this.modules.flatMap(module => module.recommendedModuleIds?.map(recommendedId => ({ source: recommendedId, target: module.id })) ?? []);

        // todo: update chart!
        this.createChart(nodes, links);
      },
    },
  },
  methods: {
    createChart(nodes: Node[], links: Link[]) {
      const canvas = document.getElementById('chart') as HTMLCanvasElement;
      const options = {
        type: ForceDirectedGraphController.id,
        data: {
          labels: nodes.map((d) => d.id),
          datasets: [{
            pointBackgroundColor: 'steelblue',
            pointRadius: 5,
            directed: true,
            data: nodes,
            edges: links,
          }]
        },
        options: {
          tree: { orientation: 'radial' },
          layout: { padding: 40 },
          plugins: {
            // todo: need to display labels more clearly
            datalabels: {
              display: (_: ChartDataLabels.Context) => {
                return true;
              },
              align: (context: ChartDataLabels.Context) => {
                const index = context.dataIndex;
                const value = context.dataset.data[index] as { angle: number };
                return (-value.angle / Math.PI) * 180;
              },
              rotation: (context: ChartDataLabels.Context) => {
                const index = context.dataIndex;
                const value = context.dataset.data[index] as { angle: number };
                return (-value.angle / Math.PI) * 180;
              },
              backgroundColor: 'white',
              formatter: (value: { displayName: string }) => {
                return value.displayName;
              },
            },
          },
        },
        plugins: [ChartDataLabels],
      };
      new Chart(canvas, <any>options);
    }
  }
});
</script>

<template>
  <canvas id="chart" />
</template>

<script lang="ts">
import { Chart, LinearScale, PointElement } from 'chart.js/auto';
import { defineComponent } from 'vue';
import { ForceDirectedGraphController, EdgeLine } from 'chartjs-chart-graph';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default defineComponent({
  name: 'ModuleDependencyGraph',
  mounted() {
    const modules = [
      { id: 'AN1', recommendedModuleIds: [] },
      { id: 'AN2', recommendedModuleIds: ['AN1'] },
      { id: 'AIFo', recommendedModuleIds: ['AN1', 'AN2'] },
      { id: 'AIAp', recommendedModuleIds: ['AIFo'] }
    ];

    const nodes = modules.map(module => ({id: module.id}));
    const links = modules.flatMap(module => module.recommendedModuleIds.map(recommendedId => ({source: recommendedId, target: module.id})));

    this.createChart({nodes, links})
  },
  methods: {
    createChart(chartData: {nodes: {id: string}[], links: any[]}) {
      Chart.register(ForceDirectedGraphController, EdgeLine, LinearScale, PointElement, ChartDataLabels);
      const canvas = document.getElementById('chart') as HTMLCanvasElement;
      const options = {
        type: ForceDirectedGraphController.id,
        data: {
            labels: chartData.nodes.map((d) => d.id),
            datasets: [{
              pointBackgroundColor: 'steelblue',
              pointRadius: 5,
              directed: true,
              data: chartData.nodes,
      edges: chartData.links,
            }]
          },
          options: {
            tree: {
              orientation: 'radial'
      },
            layout: {
      padding: 40,
            },
            plugins: {
              datalabels: {
        display: (context: ChartDataLabels.Context) => {
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
        formatter: (v: {id: string}) => {
          return v.id;
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

<template>
  <canvas id="chart" />
</template>

<script lang="ts">
import { Chart, LinearScale, PointElement, type ChartOptions, type ChartTypeRegistry, type ChartConfiguration } from 'chart.js/auto';
import { defineComponent } from 'vue';
import { ForceDirectedGraphController, EdgeLine } from 'chartjs-chart-graph';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { Module } from '../../helpers/types';

type Node = { id: string, displayName: string };
type Link = { source: string, target: string };

Chart.register(ForceDirectedGraphController, EdgeLine, LinearScale, PointElement, ChartDataLabels);

// todo: labels (should not hide arrow)
// todo: no animation (faster render)
// todo: keep things closer together (way too speard apart)

const chartOptions: ChartOptions<'forceDirectedGraph' | ChartDataLabels> = {
  tree: { orientation: 'radial' },
  layout: { padding: 20 },
  plugins: {
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
};

export default defineComponent({
  name: 'ModuleDependencyGraph',
  props: {
    modules: {
      type: Array<Module>,
      required: true,
    },
  },
  data() {
    return {
      chart: null as any | null,
    };
  },
  watch: {
    modules: {
      deep: true,
      immediate: false,
      handler(newValue: Module[]) {
        const nodes = [...newValue.map(module => ({ id: module.id, displayName: module.name }))];
        let links = [...newValue.flatMap(module => module.recommendedModuleIds.map(recommendedId => ({ source: recommendedId, target: module.id })) ?? [])];
        links = links.filter(link => nodes.some(node => node.id === link.source) && nodes.some(node => node.id === link.target));

        console.log({ nodes, links });

        this.createChart(nodes, links);
      },
    },
  },
  methods: {
    createChart(nodes: Node[], links: Link[]) {
      if (this.chart) {
        this.chart.destroy();
      }
      const canvas = (document.getElementById('chart') as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D;
      const config: ChartConfiguration<'forceDirectedGraph' | ChartDataLabels> = {
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
        options: chartOptions,
        plugins: [ChartDataLabels],
      };
      this.chart = new Chart(canvas, config);
    },
  },
});
</script>

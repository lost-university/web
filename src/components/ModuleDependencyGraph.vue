<template>
  <canvas id="doughnut" />
</template>

<script lang="ts">
import { Chart, LinearScale, PointElement } from 'chart.js/auto';
import { defineComponent } from 'vue';
import { ForceDirectedGraphController, EdgeLine } from 'chartjs-chart-graph';


export default defineComponent({
  name: 'ModuleDependencyGraph',
  mounted() {
    this.createChart({
      datasets: [
        {
          data: [
          { "name": "1" },
  { "name": "11", "parent": 0 },
  { "name": "111", "parent": 1 },
          ]
        }
      ],
      labels: ['Red', 'Green', 'Blue']
    });
  },
  methods: {
    createChart(chartData: any) {
      Chart.register(ForceDirectedGraphController, EdgeLine, LinearScale, PointElement);
      const canvas = document.getElementById('doughnut') as HTMLCanvasElement;
      const options = {
        type: ForceDirectedGraphController.id,
        data: chartData,
      };
      new Chart(canvas, options);
    }
  }
});
</script>

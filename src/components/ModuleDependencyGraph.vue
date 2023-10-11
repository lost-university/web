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
    // this.createChart({
    //   labels: ['A', 'B', 'C'], // node labels
    //   datasets: [{
    //     data: [ // nodes as objects
    //       { x: 1, y: 2 }, // x, y will be set by the force directed graph and can be omitted
    //       { x: 3, y: 1, parent: 0 },
    //       { x: 5, y: 3, parent: 0 }
    //     ]
    //   }]
    // });
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
      const canvas = document.getElementById('doughnut') as HTMLCanvasElement
      const options = {
        type: ForceDirectedGraphController.id,
        // type: 'doughnut',
        data: chartData,
        //     options: {
        // plugins: {
        //   datalabels: {
        //     display: false,
        //   },
        // },
        // tree: {
        //   mode: 'tree',
        // },
        // },
      }
      new Chart(canvas, options);
    }
  }
});
</script>

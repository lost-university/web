<template>
  <div class="flex flex-row wrapper">
    <VNetworkGraph
      class="graph"
      :nodes="networkGraphData.nodes"
      :edges="networkGraphData.edges"
    >
      <template #override-node="{ nodeId, scale, config, ...slotProps }">
        <ModuleComponent
          :id="nodeId"
          :key="nodeId"
          :module="module()"
          :semester="semester()"
          class="mb-20 h-20 w-20"
        />
      </template>
    </VNetworkGraph>
    <VueFlow
      :nodes="vueFlowGraphNodes"
      :edges="vueFlowGraphEdges"
    >
      <!-- Define the Gradient -->
      <svg width="0" height="0">
        <defs>
          <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="blue" />
            <stop offset="100%" stop-color="red" />
          </linearGradient>
        </defs>
      </svg>

      <template #node-module="props">
        <ModuleComponent
          :id="parseInt(props.id)"
          :key="parseInt(props.id)"
          :module="module()"
          :semester="semester()"
        />
      </template>
    </VueFlow>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {VNetworkGraph} from 'v-network-graph';
import {MarkerType, VueFlow} from '@vue-flow/core';
import type {Module} from "../helpers/types";
import {Semester} from "../helpers/types";
import ModuleComponent from "../components/Module.vue";

export default defineComponent({
  name: 'Graph',
  components: {
    ModuleComponent,
    VNetworkGraph,
    VueFlow,
  },
  computed: {
    vueFlowGraphNodes() {
      return [
        {
          id: '1',
          type: 'module',
          position: {x: 0, y: 0},
          data: {label: 'Node 1'},
        },
        {
          id: '2',
          type: 'module',
          position: {x: 100, y: 200},
          data: {label: 'Node 2'},
        },
        {
          id: '3',
          type: 'module',
          position: {x: 200, y: 400},
          data: {label: 'Node 3'},
        },
        {
          id: '4',
          type: 'module',
          position: {x: 300, y: 600},
          data: {
            label: 'Node 4',
          },
        }]
    },
    vueFlowGraphEdges() {
      return [
        {
          id: 'e1->2',
          source: '1',
          target: '2',
          markerEnd: { type: MarkerType.ArrowClosed, color: 'red' },
          style: { strokeWidth: 4, stroke: 'red' },
        },
        {
          id: 'e2->3',
          source: '2',
          target: '3',
          markerEnd: MarkerType.ArrowClosed,
          style: { strokeWidth: 4, stroke: 'url(#edgeGradient)' },
        },
        {
          id: 'e3->4',
          type: 'special',
          source: '3',
          target: '4',
          markerEnd: MarkerType.ArrowClosed,
          style: { strokeWidth: 4 },
        }
      ]
    },
    networkGraphData() {
      const nodes = {
        node1: {name: "Node 1"},
        node2: {name: "Node 2"},
        node3: {name: "Node 3"},
        node4: {name: "Node 4"},
      }
      const edges = {
        edge1: {source: "node1", target: "node2"},
        edge2: {source: "node2", target: "node3"},
        edge3: {source: "node3", target: "node4"},
      }

      return {nodes, edges}
    }
  },
  methods: {
    module(): Module {
      return {
        id: "PhAI",
        name: "Physik Anwendungen für Informatik",
        url: "allModules/43544_M_PhAI.json",
        categoriesForColoring: [
          "MaPh"
        ],
        ects: 4,
        isDeactivated: false,
        term: "FS",
        successorModuleId: null,
        predecessorModuleId: null,
        recommendedModuleIds: [
          "An1I",
          "An2I"
        ],
        dependentModuleIds: [],
        validationInfo: null,
        nextPossibleSemester: {
          isSpringSemester: true,
          year: 2026
        }
      };
    },
    semester(): Semester {
      return {
        "number": 5,
        "name": "HS26",
        "modules": [
          {
            "id": "PmQm",
            "name": "Projekt- und Qualitätsmanagement",
            "url": "allModules/28231_M_PmQm.json",
            "categoriesForColoring": [
              "gwr"
            ],
            "ects": 4,
            "isDeactivated": false,
            "term": "HS",
            "successorModuleId": null,
            "predecessorModuleId": null,
            "recommendedModuleIds": [],
            "dependentModuleIds": [],
            "validationInfo": null,
            "nextPossibleSemester": {
              "isSpringSemester": false,
              "year": 2025
            }
          },
          {
            "id": "SAI21",
            "name": "Studienarbeit Informatik",
            "url": "allModules/40906_M_SAI21.json",
            "categoriesForColoring": [
              "Inf",
              "SaBa"
            ],
            "ects": 8,
            "isDeactivated": false,
            "term": "both",
            "successorModuleId": null,
            "predecessorModuleId": null,
            "recommendedModuleIds": [
              "SEProj"
            ],
            "dependentModuleIds": [
              "BAI21"
            ],
            "validationInfo": null,
            "nextPossibleSemester": {
              "isSpringSemester": false,
              "year": 2025
            }
          },
          {
            "id": "WI2",
            "name": "Business Processes für Informatik",
            "url": "allModules/40981_M_WI2.json",
            "categoriesForColoring": [
              "gwr"
            ],
            "ects": 4,
            "isDeactivated": false,
            "term": "HS",
            "successorModuleId": null,
            "predecessorModuleId": "BuPro",
            "recommendedModuleIds": [],
            "dependentModuleIds": [],
            "validationInfo": null,
            "nextPossibleSemester": {
              "isSpringSemester": false,
              "year": 2025
            }
          }
        ],
        "moduleIds": [
          "PmQm",
          "SAI21",
          "WI2"
        ]
      } as Semester;
    },
  },
});

</script>

<style scoped>
.wrapper {
  width: 100%;
  height: 900px;
}

.wrapper > * {
  border: 1px solid #000;
  width: 100%;
}
</style>

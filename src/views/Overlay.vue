<template>
  <div class="container" ref="container">
    <svg class="lines-overlay">
      <line
        v-for="(line, index) in lines"
        :key="index"
        :x1="line.x1"
        :y1="line.y1"
        :x2="line.x2"
        :y2="line.y2"
        :stroke="line.color"
        stroke-width="2"
      />
    </svg>

    <draggable
      v-model="items"
      class="gap-y-1 flex flex-col items-center"
      group="test"
      item-key="id"
      :animation="200"
      :delay-on-touch-only="true"
      :delay="500"
      @end="updateLines"
    >
      <template #item="{ element }">
        <ModuleComponent
          :id="element.id"
          :key="element.id"
          :ref="'itemRef' + element.id"
          :module="module()"
          :semester="semester()"
          class="mb-20"
          @on-delete="$emit('on-module-deleted', $event)"
        />
      </template>
    </draggable>
  </div>
</template>

<script lang="ts">
import draggable from "vuedraggable";
import ModuleComponent from "../components/Module.vue";
import {type Module, Semester} from "../helpers/types";

export default {
  components: {ModuleComponent, draggable},

  data() {
    return {
      items: [{id: 1, name: "Item 1"}, {id: 2, name: "Item 2"}, {id: 3, name: "Item 3"}],
      lines: [],
      itemRefs: []
    };
  },
  mounted() {
    this.$nextTick(this.updateLines);
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
    getRandomColor() {
      return "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0"); // Random bright color
    },
    collectRefs() {
      const refs: any[] = [];
      this.items.forEach((item) => {
        const itemRef = this.$refs[`itemRef${item.id}`];
        if (itemRef) {
          refs.push(itemRef.getElement());
        }
      });
      return refs;
    },
    updateLines() {
      this.$nextTick(() => {
        this.lines = [];

        const itemElements = this.collectRefs();

        console.log(itemElements)
        if (itemElements.length < 2) return;

        const containerRect = this.$refs.container.getBoundingClientRect();

        for (let i = 0; i < itemElements.length - 1; i++) {
          const rect1 = itemElements[i]?.getBoundingClientRect();
          const rect2 = itemElements[i + 1]?.getBoundingClientRect();

          if (rect1 && rect2) {
            this.lines.push({
              x1: rect1.x + rect1.width / 2 - containerRect.x,
              y1: rect1.y + rect1.height / 2 - containerRect.y,
              x2: rect2.x + rect2.width / 2 - containerRect.x,
              y2: rect2.y + rect2.height / 2 - containerRect.y,
              color: this.getRandomColor(),
            });
          }
        }
      });
    }
  }
};
</script>

<style>
.container {
  position: relative;
  padding: 20px;
}

.lines-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>

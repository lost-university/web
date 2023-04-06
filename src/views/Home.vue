<template>
  <div class="columns">
    <div class="column">
      <h1 class="title">Plane deine Module</h1>
      <div class="is-flex is-align-content-space-evenly is-justify-content-left">
        <label class="is-flex is-flex-direction-column is-justify-content-center">
          <p>Letztes erfolgreich abgeschlossenes Semester</p>
        </label>
          <div class="select pl-2">
            <select v-model="lastSemesterNumber">
              <option
                v-for="semester in semesters"
                :key="semester.number">
                {{ semester.number }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="column is-narrow">
      <Transition>
        <div v-if="errorMsg" class="notification is-danger">
          <span>- {{ errorMsg }}</span>
        </div>
      </Transition>
    </div>
    <div class="column is-narrow">
      <Transition>
        <div v-if="unknownModules?.length" class="notification is-danger">
          Following modules could not be restored:
          <ul>
            <li v-for="unknown in unknownModules" :key="unknown.moduleId">
              {{ unknown.moduleId }}
            </li>
          </ul>
          <button class="button" v-on:click="removeUnknownModulesFromUrl">
            Remove all from URL</button>
        </div>
      </Transition>
    </div>
  </div>
  <div class="columns schedule">
    <div class="column semester" v-for="semester in semesters" :key="semester.name">
      <Semester
        @on-module-deleted="(moduleId) => onModuleDeleted(semester.number, moduleId)"
        @on-add-module="addModule"
        @on-remove-semester="removeSemester"
        :number="semester.number"
        v-model:modules="semester.modules"
        :all-modules="modules"
      ></Semester>
    </div>
    <div class="column add-semester">
      <button class="add-semester-btn button is-dark is-fullwidth" v-on:click="addSemester">
        +
      </button>
    </div>
  </div>
  <div class="columns desktop-ml-6 desktop-mt-6">
    <div class="column">
      <article>
        <h2 class="subtitle">Übersicht der ECTS Punkte</h2>
        <table>
          <tbody>
          <tr
            v-for="category in mappedCategories"
            :key="category.name"
            v-bind:class="category.categoryClass">
            <td style="vertical-align:bottom;padding-right:1em;text-align:end">
              {{ category.name }}
            </td>
            <td style="padding-top:8px">
              <BeautifulProgressIndicator
              :required=category.required_ects
              :earned=category.earnedCredits
              :planned=category.plannedCredits
              :color="category.color"
              ></BeautifulProgressIndicator>
            </td>
          </tr>
          <tr>
            <td style="vertical-align:bottom;padding-right:1em;text-align:end">
              Total
            </td>
            <td style="padding-top:8px">
              <BeautifulProgressIndicator
              :required=180
              :earned="totalEarnedEcts"
              :planned="totalPlannedEcts"
              :color="`orange`"
              ></BeautifulProgressIndicator>
            </td>
          </tr>
          </tbody>
        </table>
      </article>
    </div>
    <div class="column">
      <article>
        <h2 class="subtitle">Vertiefungen</h2>
        <div class="columns is-multiline mt-5">
          <div v-for="focus in mappedFocuses"
            :key="focus.name" class="column is-full">
            <Focus
              :name="focus.name"
              :allModules="focus.modules"
              :filteredModules="focus.filteredModules"
            ></Focus>
          </div>
        </div>
      </article>
    </div>
    <div class="column">
      <img src="../assets/this_is_fine.jpg">
    </div>
  </div>
</template>

<script>
import Semester from '../components/Semester.vue';
import Focus from '../components/Focus.vue';
import BeautifulProgressIndicator from '../components/BeautifulProgressIndicator.vue';
import { getColorForCategory } from '../helpers/color-helper';

const BASE_URL = 'https://raw.githubusercontent.com/lost-university/data/2.5/data';
const ROUTE_MODULES = '/modules.json';
const ROUTE_CATEGORIES = '/categories.json';
const ROUTE_FOCUSES = '/focuses.json';

export default {
  name: 'Home',
  data() {
    return {
      semesters: [],
      modules: [],
      categories: [],
      focuses: [],
      lastSemesterNumber: 0,
      errorMsg: null,
      errorTimer: null,
      unknownModules: [],
    };
  },
  watch: {
    $route: {
      handler() {
        this.semesters = this.getPlanDataFromUrl();
      },
    },
  },
  computed: {
    mappedCategories() {
      return this.categories.map((category) => ({
        earnedCredits: this.getEarnedCredits(category),
        plannedCredits: this.getPlannedCredits(category),
        color: getColorForCategory(category.id),
        ...category,
      }));
    },
    plannedModules() {
      return this.semesters
        .flatMap((semester) => semester.modules);
    },
    mappedFocuses() {
      const plannedModuleNames = this.plannedModules.map(module => module.id);
      return this.focuses.map((focus) => ({
        ...focus,
        filteredModules: focus.modules
          .filter((moduleId) => !plannedModuleNames.includes(moduleId))
          .map((moduleId) => this.modules.find((module) => module.id === moduleId).name),
      }));
    },
    totalPlannedEcts() {
      return this.getPlannedCredits();
    },
    totalEarnedEcts() {
      return this.getEarnedCredits();
    },
  },
  components: { Semester, Focus, BeautifulProgressIndicator },
  methods: {
    sumCredits: (previousTotal, module) => previousTotal + module.ects,
    getColorForCategory(categoryId) {
      return getColorForCategory(categoryId);
    },
    async getModules() {
      const response = await fetch(`${BASE_URL}${ROUTE_MODULES}`);
      return response.json();
    },
    async getCategories() {
      const response = await fetch(`${BASE_URL}${ROUTE_CATEGORIES}`);
      return (await response.json()).map((c) => ({ ...c, required_ects: Number(c.required_ects) }));
    },
    async getFocuses() {
      const response = await fetch(`${BASE_URL}${ROUTE_FOCUSES}`);
      return response.ok ? response.json() : [];
    },
    getPlanDataFromUrl() {
      const path = window.location.hash;
      const planIndicator = '#/plan/';
      const moduleSeparator = '_';
      const semesterSeparator = '-';
      function isNullOrWhitespace(input) {
        return !input || !input.trim();
      }
      if (path.startsWith(planIndicator)) {
        return path
          .slice(planIndicator.length)
          .split(semesterSeparator)
          .map((semesterPart, index) => ({
            number: index + 1,
            modules: semesterPart
              .split(moduleSeparator)
              .filter((id) => !(isNullOrWhitespace(id)))
              .map((moduleId) => {
                const newModule = this.modules.find((module) => module.id === moduleId);
                if (newModule == null) {
                  this.showUnknownModulesError(index + 1, moduleId);
                }
                return newModule;
              })
              .filter((module) => module),
          }));
      }

      const cachedPlan = localStorage.getItem('plan');
      if (cachedPlan != null) {
        window.location.hash = cachedPlan;
      }

      return [];
    },
    updateUrlFragment() {
      const encodedPlan = this.semesters
        .map((semester) => semester.modules.map((module) => module.id).join('_'))
        .join('-');

      window.location.hash = `plan/${encodedPlan}`;

      if (encodedPlan !== []) {
        localStorage.setItem('plan', window.location.hash);
      }
    },
    getPlannedSemesterForModule(moduleName) {
      return this.semesters.find(
        (semester) => semester.modules.some(module => module.name === moduleName),
      )?.number;
    },
    getEarnedCredits(category = undefined) {
      return this.semesters
        .filter((semester) => semester.number <= this.lastSemesterNumber)
        .flatMap((semester) => semester.modules)
        .filter((module) => category === undefined || category.modules.includes(module.id))
        .reduce(this.sumCredits, 0);
    },
    getPlannedCredits(category = undefined) {
      return this.semesters
        .filter((semester) => semester.number > this.lastSemesterNumber)
        .flatMap((semester) => semester.modules)
        .filter((module) => category === undefined || category.modules.includes(module.id))
        .reduce(this.sumCredits, 0);
    },
    addModule(moduleName, semesterNumber) {
      const blockingSemesterNumber = this.getPlannedSemesterForModule(moduleName);
      if (blockingSemesterNumber) {
        const text = `Module ${moduleName} is already in semester ${blockingSemesterNumber}`;
        // eslint-disable-next-line no-console
        console.warn(text);
        this.showErrorMsg(text);
        return;
      }

      const module = this.modules.find((item) => item.name === moduleName);

      if (module === undefined) {
        this.showErrorMsg(`Module '${moduleName}' does not exist`);
        return;
      }

      this.semesters[semesterNumber - 1].modules.push(module);
      this.updateUrlFragment();
    },
    removeModule(semesterNumber, moduleId) {
      this.semesters[semesterNumber - 1].modules = this.semesters[semesterNumber - 1].modules
        .filter((module) => module.id !== moduleId);
      this.unknownModules = this.unknownModules.filter((f) => f.moduleId !== moduleId);

      this.updateUrlFragment();
    },
    addSemester() {
      this.semesters.push({
        number: this.semesters.length + 1,
        modules: [],
      });
    },
    removeSemester(semesterNumber) {
      this.semesters = this.semesters.filter((semester) => semester.number !== semesterNumber);
      this.unknownModules = this.unknownModules.filter((f) => f.semesterNumber !== semesterNumber);
      this.updateUrlFragment();
    },
    showErrorMsg(text) {
      if (this.errorTimer !== null) {
        clearTimeout(this.errorTimer);
      }
      this.errorMsg = text;
      this.errorTimer = setTimeout(() => {
        this.errorMsg = null;
      }, 3000);
    },
    showUnknownModulesError(semesterNumber, moduleId) {
      if (this.unknownModules.find((f) => f.moduleId === moduleId)) return;
      this.unknownModules.push({ semesterNumber, moduleId });
    },
    removeUnknownModulesFromUrl() {
      this.unknownModules = [];
      this.updateUrlFragment();
    },
    onModuleDeleted(semesterNumber, moduleId) {
      this.removeModule(semesterNumber, moduleId);
    },
  },
  async mounted() {
    this.modules = await this.getModules();
    this.semesters = this.getPlanDataFromUrl();
    this.categories = await this.getCategories();
    this.focuses = await this.getFocuses();
  },
};
</script>

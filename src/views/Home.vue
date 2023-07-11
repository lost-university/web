<template>
  <div class="columns">
    <div class="column">
      <h1 class="title">
        Plane deine Module
      </h1>
      <div class="is-flex is-align-content-space-evenly is-justify-content-left">
        <label
          class="is-flex is-flex-direction-column is-justify-content-center"
          for="last-semester-select"
        >
          <p>Letztes erfolgreich abgeschlossenes Semester</p>
        </label>
        <div class="select pl-2">
          <select
            id="last-semester-select"
            v-model="lastSemesterNumber"
          >
            <option
              v-for="semester in semesters"
              :key="semester.number"
            >
              {{ semester.number }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="column is-narrow">
      <Transition>
        <div
          v-if="errorMsg"
          class="notification is-danger"
        >
          <span>- {{ errorMsg }}</span>
        </div>
      </Transition>
    </div>
    <div class="column is-narrow">
      <Transition>
        <div
          v-if="unknownModules?.length"
          class="notification is-danger"
        >
          Following modules could not be restored:
          <ul>
            <li
              v-for="unknown in unknownModules"
              :key="unknown.moduleId"
            >
              {{ unknown.moduleId }} in semester {{ unknown.semesterNumber }}
            </li>
          </ul>
          <button
            class="button"
            type="button"
            @click="removeUnknownModulesFromUrl"
          >
            Remove all from URL
          </button>
        </div>
      </Transition>
    </div>
  </div>
  <div class="columns schedule">
    <div
      v-for="semester in semesters"
      :key="semester.number"
      class="column semester"
    >
      <SemesterComponent
        v-model:modules="semester.modules"
        :number="semester.number"
        :all-modules="modules"
        @on-module-deleted="(moduleId: string) => onModuleDeleted(semester.number, moduleId)"
        @on-add-module="addModule"
        @on-remove-semester="removeSemester"
      />
    </div>
    <div class="column add-semester">
      <button
        class="add-semester-btn button is-dark is-fullwidth"
        type="button"
        @click="addSemester"
      >
        +
      </button>
    </div>
  </div>
  <div class="columns desktop-ml-6 desktop-mt-6">
    <div class="column">
      <article>
        <h2 class="subtitle">
          Übersicht der ECTS Punkte
        </h2>
        <table>
          <tbody>
            <!-- <tr v-for="category in mappedCategories" :key="category.name" v-bind:class="category.categoryClass"> -->
            <tr
              v-for="category in mappedCategories"
              :key="category.name"
            >
              <td style="vertical-align:bottom;padding-right:1em;text-align:end">
                {{ category.name }}
              </td>
              <td style="padding-top:8px">
                <BeautifulProgressIndicator
                  :required="category.required_ects"
                  :earned="category.earnedCredits"
                  :planned="category.plannedCredits"
                  :color="category.color"
                />
              </td>
            </tr>
            <tr>
              <td style="vertical-align:bottom;padding-right:1em;text-align:end">
                Total
              </td>
              <td style="padding-top:8px">
                <BeautifulProgressIndicator
                  :required="180"
                  :earned="totalEarnedEcts"
                  :planned="totalPlannedEcts"
                  :color="`orange`"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </article>
    </div>
    <div class="column">
      <article>
        <h2 class="subtitle">
          Vertiefungen
        </h2>
        <div class="columns is-multiline mt-5">
          <div
            v-for="focus in mappedFocuses"
            :key="focus.name"
            class="column is-full"
          >
            <FocusComponent
              :name="focus.name"
              :all-modules="focus.modules"
              :filtered-module-names="focus.filteredModuleNames"
            />
          </div>
        </div>
      </article>
    </div>
    <div class="column">
      <img
        src="../assets/this_is_fine.jpg"
        alt="Well known 'this is fine' meme with a dog in a room on fire"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SemesterComponent from '../components/Semester.vue';
import FocusComponent from '../components/Focus.vue';
import BeautifulProgressIndicator from '../components/BeautifulProgressIndicator.vue';
import { getColorForCategoryId } from '../helpers/color-helper';
import type { Module, Category, Focus, UnknownModule, Semester } from '../helpers/types';

const BASE_URL = 'https://raw.githubusercontent.com/lost-university/data/3.1/data';
const ROUTE_MODULES = '/modules.json';
const ROUTE_CATEGORIES = '/categories.json';
const ROUTE_FOCUSES = '/focuses.json';

export default defineComponent({
  name: 'Home',
  components: { SemesterComponent, FocusComponent, BeautifulProgressIndicator },
  data() {
    return {
      semesters: [] as Semester[],
      modules: [] as Module[],
      categories: [] as Category[],
      focuses: [] as Focus[],
      lastSemesterNumber: 0,
      errorMsg: null as string | null,
      errorTimer: null as ReturnType<typeof setTimeout> | null,
      unknownModules: [] as UnknownModule[],
    };
  },
  computed: {
    mappedCategories() {
      return this.categories.map((category) => ({
        earnedCredits: this.getEarnedCredits(category),
        plannedCredits: this.getPlannedCredits(category),
        color: getColorForCategoryId(category.id),
        ...category,
      }));
    },
    plannedModules() {
      return this.semesters
        .flatMap((semester) => semester.modules);
    },
    mappedFocuses() {
      const plannedModuleIds = this.plannedModules.map((module) => module.id);
      return this.focuses.map((focus) => ({
        ...focus,
        filteredModuleNames: focus.modules
          .filter((module) => !plannedModuleIds.includes(module.id))
          .map((module) => module.name),
      }));
    },
    totalPlannedEcts() {
      return this.getPlannedCredits();
    },
    totalEarnedEcts() {
      return this.getEarnedCredits();
    },
  },
  watch: {
    $route: {
      handler() {
        this.semesters = this.getPlanDataFromUrl();
      },
    },
  },
  async mounted() {
    this.modules = await this.getModules();
    this.semesters = this.getPlanDataFromUrl();
    this.categories = await this.getCategories();
    this.focuses = await this.getFocuses();
  },
  methods: {
    sumCredits: (previousTotal: number, module: Module) => previousTotal + module.ects,
    getColorForCategoryId(categoryId: string): string {
      return getColorForCategoryId(categoryId);
    },
    async getModules(): Promise<Module[]> {
      const response = await fetch(`${BASE_URL}${ROUTE_MODULES}`);
      return response.json();
    },
    async getCategories(): Promise<Category[]> {
      const response = await fetch(`${BASE_URL}${ROUTE_CATEGORIES}`);
      return (await response.json()).map((c: Category) => ({ ...c, required_ects: Number(c.required_ects) }));
    },
    async getFocuses(): Promise<Focus[]> {
      const response = await fetch(`${BASE_URL}${ROUTE_FOCUSES}`);
      return response.ok ? response.json() : [];
    },
    getPlanDataFromUrl(): Semester[] {
      let path = window.location.hash;
      const planIndicator = '#/plan/';
      const moduleSeparator = '_';
      const semesterSeparator = '-';
      function isNullOrWhitespace(input: string) {
        return !input || !input.trim();
      }

      if (!path.startsWith(planIndicator)) {
        const cachedPlan = localStorage.getItem('plan');
        if (cachedPlan) {
          window.location.hash = cachedPlan;
          path = cachedPlan;
        }
      }

      if (path.startsWith(planIndicator)) {
        // This ensures backwards compatability. Removing it after everyone who started before 2022
        // has finished their studies, so about 2026, is guaranteed to be fine.
        const newPath = path
          .replace('FunProg', 'FP')
          .replace('BAI14', 'BAI21')
          .replace('SE1', 'SEP1')
          .replace('SE2', 'SEP2')
          .replace('NISec', 'NIoSec')
          .replace('PFSec', 'PlFSec');

        const planData = newPath
          .slice(planIndicator.length)
          .split(semesterSeparator)
          .map((semesterPart, index) => ({
            number: index + 1,
            modules: semesterPart
              .split(moduleSeparator)
              .filter((id) => !(isNullOrWhitespace(id)))
              .map((moduleId) => {
                const newModule = this.modules.find((module) => module.id === moduleId);
                if (!newModule) {
                  this.showUnknownModulesError(index + 1, moduleId);
                }
                return newModule!;
              })
              .filter((module) => module),
          }));

        if (newPath !== path) {
          window.location.hash = newPath;
        }

        this.savePlanInLocalStorage(newPath);

        return planData;
      }

      return [];
    },
    updateUrlFragment() {
      const encodedPlan = this.semesters
        .map((semester) => semester.modules.map((module) => module.id).join('_'))
        .join('-');

      window.location.hash = `plan/${encodedPlan}`;

      if (encodedPlan) {
        this.savePlanInLocalStorage(window.location.hash);
      }
    },
    savePlanInLocalStorage(path: string) {
      localStorage.setItem('plan', path);
    },
    getPlannedSemesterForModule(moduleName: string): number | undefined {
      return this.semesters.find(
        (semester) => semester.modules.some((module) => module.name === moduleName),
      )?.number;
    },
    getEarnedCredits(category?: Category): number {
      return this.semesters
        .filter((semester) => semester.number <= this.lastSemesterNumber)
        .flatMap((semester) => semester.modules)
        .filter((module) => !category || category.modules.some((m) => m.id === module.id))
        .reduce(this.sumCredits, 0);
    },
    getPlannedCredits(category?: Category): number {
      return this.semesters
        .filter((semester) => semester.number > this.lastSemesterNumber)
        .flatMap((semester) => semester.modules)
        .filter((module) => !category || category.modules.some((m) => m.id === module.id))
        .reduce(this.sumCredits, 0);
    },
    addModule(moduleName: string, semesterNumber: number) {
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
    removeModule(semesterNumber: number, moduleId: string) {
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
    removeSemester(semesterNumber: number) {
      this.semesters = this.semesters.filter((semester) => semester.number !== semesterNumber);
      this.unknownModules = this.unknownModules.filter((f) => f.semesterNumber !== semesterNumber);
      this.updateUrlFragment();
    },
    showErrorMsg(text: string) {
      if (this.errorTimer !== null) {
        clearTimeout(this.errorTimer);
      }
      this.errorMsg = text;
      this.errorTimer = setTimeout(() => {
        this.errorMsg = null;
      }, 3000);
    },
    showUnknownModulesError(semesterNumber: number, moduleId: string) {
      if (this.unknownModules.find((f) => f.moduleId === moduleId)) return;
      this.unknownModules.push({ semesterNumber, moduleId });
    },
    removeUnknownModulesFromUrl() {
      this.unknownModules = [];
      this.updateUrlFragment();
    },
    onModuleDeleted(semesterNumber: number, moduleId: string) {
      this.removeModule(semesterNumber, moduleId);
    },
  },
});
</script>

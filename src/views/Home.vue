<template>
  <div class="fixed top-2 right-2 z-50">
    <ToastNotification
      v-for="message in errorMessages"
      :key="message"
      :duration="4500"
      :show-toast="true"
      :text="message"
    />
    <ToastNotification
      :text="'Folgende Module konnten nicht wiederhergestellt werden'"
      :show-toast="unknownModules?.length != 0"
      :list-items="unknownModules.map(u => `- ${u.id} in semester ${u.semesterNumber}`)"
      :dismiss-button-text="'OK'"
      @on-dismiss="removeUnknownModulesFromUrl"
    />
  </div>

  <div class="flex justify-end mx-2 relative mb-10">
    <div class="flex items-start w-full absolute top-0 right-0">
      <SwitchGroup>
        <div class="flex items-center ml-auto sm:h-8.5">
          <SwitchLabel class="mr-4">
            Validierung:
          </SwitchLabel>
          <HeadlessSwitch
            :model-value="validationEnabled"
            :class="validationEnabled ? 'bg-teal-700' : 'bg-gray-500'"
            class="relative inline-flex h-9 w-16 sm:h-6 sm:w-11 items-center rounded-full"
            @update:model-value="setValidationEnabled"
          >
            <span
              aria-hidden="true"
              :class="validationEnabled ? 'translate-x-9 sm:translate-x-6' : 'translate-x-1'"
              class="inline-block h-6 w-6 sm:h-4 sm:w-4 transform rounded-full bg-white transition"
            />
          </HeadlessSwitch>
        </div>
      </SwitchGroup>
      <GlobalValidationInfo />
    </div>
  </div>

  <div
    id="print-title"
    class="flex mb-4 hidden print:flex mt-5 ml-4"
  >
    <img
      src="/logo.png"
      class="size-30 pb-4 object-contain"
      alt="Home"
    >
    <h1 class="text-3xl font-bold pt-12">
      Studienplan
    </h1>
  </div>


  <div
    ref="plan"
    class="flex space-x-2 overflow-auto before:m-auto after:m-auto p-4
      print:overflow-visible print:origin-top-left"
    data-cy="semester-container"
  >
    <SemesterComponent
      v-for="semester in enrichedSemesters"
      :key="semester.number"
      class="bg-gray-200 dark:bg-zinc-800 rounded-sm p-2
      group/semester w-64 min-w-64"
      :semester="semester"
      @on-module-deleted="(moduleId: string) => removeModule(semester.number, moduleId)"
      @on-add-module="addModule"
      @on-remove-semester="removeSemester"
      @on-drop-end="updateUrlFragment"
    />
    <button
      class="transition-colors text-white w-8 px-2 rounded-sm"
      :class="addingSemesterIsDisabled?
        'bg-gray-300' : 'bg-gray-500 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-700'"
      type="button"
      :disabled="addingSemesterIsDisabled"
      :title="addingSemesterIsDisabled ?
        'Mehr als 14 Semester können an der OST nicht geplant werden, da sonst eine Exmatrikulation stattfindet' :
        ''
      "
      tabindex="0"
      @click="addSemester"
    >
      +
    </button>
  </div>

  <div class="mx-8 my-4 print:hidden">
    <AccreditedModules />
  </div>

  <div class="my-16 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 justify-items-center gap-y-16 print:hidden">
    <article class="px-4 w-full sm:w-96">
      <span class="text-xl">
        Übersicht der ECTS Punkte
      </span>
      <div class="my-2 flex items-center">
        <label for="last-semester-select">
          Erstes Semester:
        </label>
        <select
          id="last-semester-select"
          :value="startSemester"
          class="ml-2 px-3 py-2 rounded-sm bg-gray-200 dark:bg-gray-700"
          @change="setStartSemester($event.target.value)"
        >
          <option
            v-for="semester in selectableStartSemesters"
            :key="semester.toString()"
            :value="semester"
          >
            {{ semester.toString() }}
          </option>
        </select>
        <a
          class="ml-3 underline"
          target="_blank"
          :href="studienOrdnungToUrlMap[studienordnung]"
        >Studienordnung</a>
      </div>
      <Categories
        @on-add-module="addModule"
      />
    </article>
    <article class="px-4 w-full sm:w-[30rem]">
      <h2 class="text-xl">
        Vertiefungen
      </h2>
      <div class="mt-5">
        <div
          v-for="focus in enrichedFocuses"
          :key="focus.name"
        >
          <FocusComponent
            :name="focus.name"
            :available-modules-for-focus="focus.availableModules"
            :number-of-missing-modules="focus.numberOfMissingModules"
            @on-add-module-to-next-sem="addModule"
          />
        </div>
      </div>
    </article>
    <img
      class="lg:col-span-2 2xl:col-span-1 justify-self-center px-4"
      src="/this_is_fine.jpg"
      alt="The well known 'this is fine' meme with a dog in a room full of fire"
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Switch as HeadlessSwitch, SwitchGroup, SwitchLabel } from '@headlessui/vue'

import SemesterComponent from '../components/Semester.vue';
import FocusComponent from '../components/Focus.vue';
import ToastNotification from '../components/ToastNotification.vue';
import { UnknownModule } from '../helpers/types';
import { SemesterInfo } from "../helpers/semester-info";
import Categories from '../components/Categories.vue';
import { StorageHelper } from '../helpers/storage-helper';
import { store } from '../helpers/store';
import { mapGetters } from 'vuex';
import AccreditedModules from '../components/AccreditedModules.vue';
import GlobalValidationInfo from "../components/GlobalValidationInfo.vue";

export default defineComponent({
  name: 'Home',
  components: {
    GlobalValidationInfo,
    SemesterComponent,
    FocusComponent,
    ToastNotification,
    Categories,
    AccreditedModules,
    HeadlessSwitch,
    SwitchGroup,
    SwitchLabel,
  },
  data() {
    return {
      selectableStartSemesters: SemesterInfo.selectableStartSemesters,
      studienOrdnungToUrlMap: {
        '21': 'https://studien.ost.ch/allStudies/10191_I.html',
        '23': 'https://studien.ost.ch/allStudies/10246_I.html'
      },
      errorMessages: [] as string[],
      unknownModules: [] as UnknownModule[],
    };
  },
  computed: {
    ...mapGetters([
      'modules',
      'enrichedFocuses',
      'enrichedSemesters',
      'startSemester',
      'studienordnung',
      'validationEnabled',
    ]),
    addingSemesterIsDisabled() {
      return this.enrichedSemesters.length >= SemesterInfo.maxNumberOfAllowedSemesters;
    },
  },
  watch: {
    $route: {
      handler() {
        setTimeout(() => {
          this.getPlanDataFromUrl();
        }, 0);
      },
    },
  },
  async mounted() {
    await store.dispatch('loadModules');
    this.getPlanDataFromUrl();


    this.$nextTick(() => {
      const el = (this.$refs.plan as HTMLElement)
      const before = () => {
        const contentW = el.scrollWidth;
        const pageW    = 1540;
        const scale    = pageW / contentW ;
        el.style.transform       = `scale(${scale})`;
        el.style.transformOrigin = 'top left';
        void el.offsetWidth;
      }
      const after = () => {
        el.style.transform = '';
      }
      window.addEventListener('beforeprint', before);
      window.addEventListener('afterprint',  after);
    });
  },
  methods: {
    setStartSemester(startSemester: string) {
      const newStartSemester = SemesterInfo.parse(startSemester);
      store.dispatch('setStartSemester', newStartSemester).then(() => this.updateUrlFragment());
    },
    getPlanDataFromUrl() {
      const [
        semesters,
        accreditedModules,
        startSemester,
        validationEnabled
      ] = StorageHelper.getDataFromUrlHash(
        window.location.hash,
        (semesterNumber: number, moduleId: string) => this.showUnknownModulesError(semesterNumber, moduleId)
      );
      store.commit('setValidationEnabled', validationEnabled);
      store.commit('setSemesters', semesters);
      store.commit('setAccreditedModules', accreditedModules);
      store.dispatch('setStartSemester', startSemester).then(() => this.updateUrlFragment());
    },
    updateUrlFragment() {
      StorageHelper.updateUrlFragment();
    },
    getPlannedSemesterForModule(moduleId: string): number | undefined {
      return this.enrichedSemesters.find(
        (semester) => semester.modules.some((module) => module.id === moduleId),
      )?.number;
    },
    addModule(moduleId: string, semesterNumber?: number) {
      const module = this.modules.find((item) => item.id === moduleId);

      if (module === undefined) {
        this.showErrorMsg(`Modul '${moduleId}' existiert nicht`);
        return;
      }

      const blockingSemesterNumber = this.getPlannedSemesterForModule(moduleId);
      if (blockingSemesterNumber) {
        const text = `Modul ${module.name} ist bereits im Semester ${blockingSemesterNumber}`;
        console.warn(text);
        this.showErrorMsg(text);
        return;
      }

      if(!semesterNumber) {
        if(!module.nextPossibleSemester) {
          this.showErrorMsg(`Kein nächstmögliches Semester für Modul ${module.name} gefunden`);
          return;
        }
        let nextSemester = this.enrichedSemesters.find(s => s.name === module.nextPossibleSemester.toString())
        while(!nextSemester && !this.addingSemesterIsDisabled) {
          this.addSemester();
          nextSemester = this.enrichedSemesters.find(s => s.name === module.nextPossibleSemester.toString());
        }
        semesterNumber = nextSemester.number;
      }

      store.commit('addModuleToSemester', { semesterNumber, moduleId: moduleId });
      this.updateUrlFragment();
    },
    removeModule(semesterNumber: number, moduleId: string) {
      store.commit('removeModuleFromSemester', { semesterNumber, moduleId });
      this.unknownModules = this.unknownModules.filter((f) => f.id !== moduleId);
      this.updateUrlFragment();
    },
    addSemester() {
      if(this.addingSemesterIsDisabled) {
        this.showErrorMsg(
          `Es können nicht mehr als ${SemesterInfo.maxNumberOfAllowedSemesters} Semester geplant werden!`
        );
        return;
      }
      store.commit('addSemester')
      this.updateUrlFragment();
    },
    removeSemester(semesterNumber: number) {
      store.commit('removeSemester', semesterNumber);
      this.unknownModules = this.unknownModules.filter((f) => f.semesterNumber !== semesterNumber);
      this.updateUrlFragment();
    },
    showErrorMsg(text: string) {
      this.errorMessages.push(text);
      setTimeout(() => {
        this.errorMessages.shift();
        // clean up error messages after a minute
      }, 60000);
    },
    showUnknownModulesError(semesterNumber: number, moduleId: string) {
      if (this.unknownModules.find((f) => f.id === moduleId)) return;
      this.unknownModules.push({ semesterNumber, id: moduleId });
    },
    removeUnknownModulesFromUrl() {
      this.unknownModules = [];
      this.updateUrlFragment();
    },
    setValidationEnabled(validationEnabled: boolean) {
      store.commit('setValidationEnabled', validationEnabled);
      StorageHelper.updateUrlFragment();
    },
  },
});
</script>

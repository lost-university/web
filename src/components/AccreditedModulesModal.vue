<template>
  <button
    class="h-6 w-16 bg-gray-800 text-white text-sm rounded-sm"
    type="button"
    data-cy="AccreditedModules-OpenButton"
    @click="openModal"
  >
    +
  </button>

  <DialogComponent
    class="relative z-10"
    :open="modalIsOpen"
    @close="closeModal"
  >
    <div
      class="fixed inset-0 bg-black/30"
      aria-hidden="true"
    />
    <div class="fixed inset-0">
      <div class="flex h-full items-center justify-center">
        <DialogPanel class="w-full max-w-md py-3 px-6 text-center rounded-2xl bg-neutral-100 shadow-xl">
          <DialogTitle
            as="h3"
            class="text-xl mb-3"
          >
            Übertrittsmodul erfassen
          </DialogTitle>

          <div class="text-left">
            <div class="mb-2">
              <div>
                <input
                  id="existing-module"
                  v-model="accreditationType"
                  type="radio"
                  name="accreditation-type"
                  value="existing-module"
                  class="mr-2"
                >
                <label for="existing-module">Modul anrechnen</label>
              </div>
              <small>Ein Modul, welches auch normal an der OST angeboten wird, anrechnen.</small>
            </div>

            <div class="mb-3">
              <div>
                <input
                  id="external-module"
                  v-model="accreditationType"
                  type="radio"
                  name="accreditation-type"
                  value="external-module"
                  class="mr-2"
                >
                <label for="external-module">Externe Leistung</label>
              </div>
              <small>Eine Leistung, die nicht als normales Modul existiert, erfassen.</small>
            </div>
          </div>

          <div
            v-if="accreditationType === 'existing-module'"
            class="grid grid-flow-row mb-3"
          >
            <span class="mb-2">Ausgewählt: {{ selectedModule ? selectedModule.name : 'keines' }}</span>
            <div class="mx-auto w-fit">
              <ModuleSearch
                :button-width-class="'w-auto px-2'"
                :show-chevron="true"
                :show-next-possible-semester="false"
                :text-for-button="'Modul auswählen'"
                :disable-invalid-modules="false"
                @on-module-selected="moduleId => onModuleSelected(moduleId)"
              />
            </div>
          </div>

          <div
            v-if="accreditationType === 'external-module'"
            class="grid gap-2 w-1/2 mx-auto mb-4"
          >
            <div class="grid text-left">
              <div>
                <label
                  for="external-name"
                  class="mr-2"
                >Name</label>
                <font-awesome-icon
                  :icon="['fa', 'circle-question']"
                  class="text-gray-500"
                  title="Name darf '.', '-', '_', '~' nicht enthalten und max 30 Zeichen sein"
                  tabindex="0"
                />
              </div>
              <input
                id="external-name"
                v-model="externalName"
                class="border rounded-sm"
                required
                maxlength="30"
              >
            </div>
            <div class="grid text-left">
              <label for="external-ects">ECTS</label>
              <input
                id="external-ects"
                v-model="externalEcts"
                class="border rounded-sm"
                type="number"
                required
                min="1"
              >
            </div>
            <div class="grid text-left">
              <Listbox
                v-model="externalCategories"
                multiple
              >
                <div class="relative">
                  <ListboxLabel>Kategorien <small>(Mehrfachauswahl)</small></ListboxLabel>
                  <ListboxButton
                    class="flex justify-between w-full min-h-8 rounded-lg bg-gray-100 p-2 text-left shadow-md"
                  >
                    <span>
                      {{ externalCategories.map((c) => c.name).join(', ') }}
                    </span>
                    <font-awesome-icon :icon="'chevron-down'" />
                  </ListboxButton>
                  <ListboxOptions
                    class="absolute mt-1 max-h-60 w-full overflow-auto
                    rounded-md bg-white py-1 text-base shadow-lg z-40 divide-y divide-solid"
                  >
                    <ListboxOption
                      v-for="cat in selectableCategories"
                      :key="cat.id"
                      v-slot="{ selected, active }"
                      :value="cat"
                      as="template"
                    >
                      <li
                        class="px-2 py-1 cursor-pointer"
                        :class="active ? 'bg-gray-200' : ''"
                      >
                        <input
                          type="checkbox"
                          :checked="selected"
                          class="mr-2"
                        >
                        <span>{{ cat.name }}</span>
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </div>
              </Listbox>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              class="bg-gray-800 text-white py-1 px-2 ml-auto rounded-sm"
              type="button"
              @click="cancelChanges"
            >
              abbrechen
            </button>
            <button
              class="bg-gray-800 text-white py-1 px-2 ml-2 rounded-sm disabled:bg-gray-500"
              type="button"
              :disabled="!canSaveChanges"
              @click="saveChanges"
            >
              speichern
            </button>
          </div>
        </DialogPanel>
      </div>
    </div>
  </DialogComponent>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  Dialog as DialogComponent,
  DialogTitle,
  DialogPanel,
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue';
import { AccreditedModule, Category, Module } from '../helpers/types';
import ModuleSearch from './ModuleSearch.vue';
import { store } from '../helpers/store';
import { StorageHelper } from '../helpers/storage-helper';

export default defineComponent({
  name: 'AccreditedModulesModal',
  components: {
    DialogComponent,
    DialogTitle,
    DialogPanel,
    ModuleSearch,
    Listbox,
    ListboxLabel,
    ListboxButton,
    ListboxOptions,
    ListboxOption
  },
  data() {
    return {
      modalIsOpen: false,
      accreditationType: 'existing-module' as 'existing-module' | 'external-module',
      selectedModule: null as Module | null,
      externalName: '',
      externalEcts: 0,
      externalCategories: [] as Category[],
    };
  },
  computed: {
    selectableCategories(): Category[] {
      return store.getters.categories;
    },
    canSaveExternalModule(): boolean {
      return !!this.externalName &&
        !!this.externalEcts &&
        !!this.externalCategories.length &&
        !this.externalName.match(/[.\-_~]/g);
    },
    canSaveExistingModule(): boolean {
      return !!this.selectedModule;
    },
    canSaveChanges(): boolean {
      return this.accreditationType === 'existing-module' ? this.canSaveExistingModule : this.canSaveExternalModule;
    }
  },
  methods: {
    openModal() {
      this.modalIsOpen = true;
    },
    closeModal() {
      this.modalIsOpen = false;
    },
    onModuleSelected(moduleId: string) {
      const module = store.getters.modules.find(m => m.id === moduleId);
      if(module) {
        this.selectedModule = module;
      }
    },
    cancelChanges() {
      this.externalName = '';
      this.externalEcts = 0;
      this.externalCategories = [];
      this.selectedModule = null;
      this.closeModal();
    },
    saveChanges() {
      switch(this.accreditationType) {
        case 'existing-module':
          this.saveExistingModule();
          break;
        case 'external-module':
          this.saveExternalModule();
      }

      StorageHelper.updateUrlFragment();
      this.closeModal();
    },
    saveExternalModule() {
      if(this.canSaveExternalModule) {
        const accreditedModule = AccreditedModule.createFromExternalData(
          this.externalName,
          this.externalEcts,
          this.externalCategories.map(m => m.id)
        );
        store.commit('addAccreditedModule', accreditedModule);
        this.externalName = '';
        this.externalEcts = 0;
        this.externalCategories = [];
      }
    },
    saveExistingModule() {
      if (this.canSaveExistingModule) {
        const accreditedModule = AccreditedModule.createFromExistingModule(this.selectedModule!);
        store.commit('addAccreditedModule', accreditedModule);
        this.selectedModule = null;
      }
    }
  }
});
</script>

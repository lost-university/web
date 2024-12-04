<template>
  <button
    class="h-6 w-16 bg-gray-800 text-white text-sm rounded"
    type="button"
    @click="openModal"
  >
    +
  </button>

  <DialogComponent
    class="relative z-10"
    :open="modalIsOpen"
    @close="closeModal"
  >
    <div class="fixed inset-0">
      <div class="flex h-full items-center justify-center">
        <DialogPanel class="w-full max-w-lg rounded-2xl bg-neutral-100 shadow-xl">
          <div class="w-full p-2">
            <TabGroup>
              <TabList class="bg-neutral-100">
                <Tab
                  v-slot="{ selected }"
                  class="w-1/2"
                >
                  <button
                    class="w-full py-2 rounded-t-lg"
                    :class="selected ? 'bg-white' : 'hover:bg-white/[0.12]'"
                  >
                    Module anrechnen
                  </button>
                </Tab>
                <Tab
                  v-slot="{ selected }"
                  class="w-1/2"
                >
                  <button
                    class="w-full py-2 rounded-t-lg"
                    :class="selected ? 'bg-white' : 'hover:bg-white/[0.12]'"
                  >
                    Externe Eingabe
                  </button>
                </Tab>
              </TabList>

              <TabPanels class="bg-white p-2">
                <TabPanel>
                  <div class="grid grid-flow-row">
                    <div>
                      <ModuleSearch
                        :button-width-class="'w-16'"
                        :show-next-possible-semester="false"
                        @on-module-selected="moduleId => onModuleSelected(moduleId)"
                      />
                    </div>
                    <div>
                      <ul>
                        <li
                          v-for="selectedModule in selectedModules"
                          :key="selectedModule.id"
                        >
                          {{ selectedModule.name }}
                        </li>
                      </ul>
                    </div>
                    <div class="flex justify-end">
                      <button
                        class="bg-gray-800 text-white py-1 px-2 rounded"
                        type="button"
                        @click="addExistingModule"
                      >
                        hinzufügen
                      </button>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div class="grid grid-rows-[auto_auto] grid-cols-2 gap-2 mb-4">
                    <div>
                      <label
                        for="external-name"
                        class="mr-1"
                      >Name</label>
                      <input
                        id="external-name"
                        v-model="externalName"
                        class="border rounded"
                        required
                        maxlength="30"
                      >
                      <span
                        v-if="showNameErrorHint"
                        class="text-red-400 text-xs"
                      >
                        Name darf ".", "-", "_", "~" nicht enthalten und max 30 Zeichen sein
                      </span>
                    </div>
                    <div>
                      <label
                        for="external-ects"
                        class="mr-1"
                      >ECTS</label>
                      <input
                        id="external-ects"
                        v-model="externalEcts"
                        class="border rounded"
                        type="number"
                        required
                        min="1"
                      >
                    </div>
                    <div class="col-span-2">
                      <Listbox
                        v-model="externalCategories"
                        multiple
                      >
                        <div class="relative">
                          <ListboxLabel>Kategorien</ListboxLabel>
                          <ListboxButton class="w-full min-h-8 rounded-lg bg-gray-100 p-2 text-left shadow-md">
                            {{ externalCategories.map((c) => c.name).join(', ') }}
                          </ListboxButton>
                          <ListboxOptions
                            class="absolute mt-1 max-h-60 w-full overflow-auto
                            rounded-md bg-white py-1 text-base shadow-lg z-40"
                          >
                            <ListboxOption
                              v-for="cat in selectableCategories"
                              :key="cat.id"
                              v-slot="{ selected }"
                              :value="cat"
                              as="template"
                            >
                              <li
                                class="px-2 my-1"
                                :class="[selected ? 'bg-slate-200' : '']"
                              >
                                <span class="">
                                  {{ cat.name }}
                                </span>
                              </li>
                            </ListboxOption>
                          </ListboxOptions>
                        </div>
                      </Listbox>
                    </div>
                  </div>
                  <div class="flex justify-end">
                    <button
                      class="bg-gray-800 text-white py-1 px-2 rounded"
                      type="button"
                      @click="addExternalEcts"
                    >
                      hinzufügen
                    </button>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>

          <div class="grid grid-flow-row m-4">
            <div>
              <span>Ausgewählte Module:</span>
              <div class="flex flex-wrap ml-1">
                <div
                  v-for="accreditedModule in accreditedModules"
                  :key="accreditedModule"
                  class="m-1"
                >
                  <AccreditedModuleBadge
                    :accredited-module="accreditedModule"
                    @on-remove-clicked="removeAccreditedModule(accreditedModule)"
                  />
                </div>
              </div>
            </div>
            <button
              class="bg-gray-800 text-white py-1 px-2 ml-auto rounded"
              type="button"
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
  DialogPanel,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
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
import AccreditedModuleBadge from './AccreditedModuleBadge.vue';

export default defineComponent({
  name: 'AccreditedModulesModal',
  components: {
    DialogComponent,
    DialogPanel,
    TabGroup,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    ModuleSearch,
    AccreditedModuleBadge,
    Listbox,
    ListboxLabel,
    ListboxButton,
    ListboxOptions,
    ListboxOption
  },
  data() {
    return {
      modalIsOpen: false,
      accreditedModules: [] as AccreditedModule[],
      externalName: '',
      externalEcts: 0,
      externalCategories: [] as Category[],
      selectedModules: [] as Module[],
      showNameErrorHint: false,
    };
  },
  computed: {
    selectableCategories(): Category[] {
      return store.getters.categories;
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
        this.selectedModules.push(module);
      }
    },
    addExistingModule() {
      this.accreditedModules.push(...this.selectedModules.map(m => AccreditedModule.createFromExistingModule(m)));
      this.selectedModules = [];
    },
    addExternalEcts() {
      if(this.externalName && this.externalEcts && this.externalCategories.length) {
        if(this.externalName.match(/[.\-_~]/g)) {
          console.error('".", "-", "_" and "~" not allowed in name');
          this.showNameErrorHint = true;
          return;
        }
        this.accreditedModules.push(
          AccreditedModule.createFromExternalData(
            this.externalName,
            this.externalEcts,
            this.externalCategories.map(c => c.id)
          )
        );
        this.externalName = '';
        this.externalEcts = 0;
        this.externalCategories = [];
      }
    },
    removeAccreditedModule(accreditedModule: AccreditedModule) {
      this.accreditedModules.splice(this.accreditedModules.indexOf(accreditedModule), 1);
    },
    saveChanges() {
      if(!this.accreditedModules.length) {
        return;
      }

      store.commit('addAccreditedModules', this.accreditedModules);
      StorageHelper.updateUrlFragment()
      this.accreditedModules = [];
      this.closeModal();
    },
  }
});
</script>

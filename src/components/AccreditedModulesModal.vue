<template>
  <button class="h-6 w-16 bg-gray-800 text-white text-sm rounded" type="button" @click="openModal">+</button>

  <Dialog class="relative z-10" @close="closeModal" :open="modalIsOpen">
    <div class="fixed inset-0">
      <div class="flex h-full items-center justify-center">
        <DialogPanel class="w-full max-w-lg rounded-2xl bg-neutral-100 shadow-xl">

          <div class="w-full p-2">
            <TabGroup>
              <TabList class="bg-neutral-100">
                <Tab v-slot="{ selected }" class="w-1/2">
                  <button class="w-full py-2 rounded-t-lg" :class="selected ? 'bg-white' : 'hover:bg-white/[0.12]'">Module anrechnen</button>
                </Tab>
                <Tab v-slot="{ selected }" class="w-1/2">
                  <button class="w-full py-2 rounded-t-lg" :class="selected ? 'bg-white' : 'hover:bg-white/[0.12]'">Externe Eingabe</button>
                </Tab>
              </TabList>

              <TabPanels class="bg-white p-2">
                <TabPanel>
                  <div class="grid grid-flow-row">
                    <div>
                      <ModuleSearch :width-class="'w-16'" :show-next-possible-semester="false" @on-module-selected="moduleName => onModuleSelected(moduleName)"/>
                    </div>
                    <div>
                      <ul>
                        <li v-for="selectedModule in selectedModules">
                          {{ selectedModule.name }}
                        </li>
                      </ul>
                    </div>
                    <div class="flex justify-end">
                      <button class="bg-gray-800 text-white py-1 px-2 rounded" type="button" @click="addExistingModule">hinzufügen</button>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div class="grid grid-rows-2 grid-cols-2 gap-2">
                    <div>
                      <label for="external-name" class="mr-1">Name</label>
                      <input id="external-name" class="border rounded" v-model="externalName" required maxlength="30">
                    </div>
                    <div>
                      <label for="external-ects" class="mr-1">ECTS</label>
                      <input id="external-ects" class="border rounded" v-model="externalEcts" type="number" required min="1">
                    </div>
                    <div>
                      <label for="external-categories" class="mr-1">Kategorien</label>
                      <select
                        id="external-categories"
                        class="w-1/6"
                      >
                        <option value="" disabled selected hidden></option>
                        <option v-for="category in selectableCategories" :key="category.id" @click="onCategoryClicked(category)">{{ category.name }}</option>
                      </select>
                    </div>
                  </div>                   <span>{{ externalCategories.map(c => c.name).join(', ') }}</span>
                  <div class="flex justify-end">
                    <button class="bg-gray-800 text-white py-1 px-2 rounded" type="button" @click="addExternalEcts">hinzufügen</button>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>

          <div class="m-4" v-if="accreditedModules.length">
            <div>
              <span>Ausgewählte Module:</span>
              <div class="flex flex-wrap ml-1">
              <div v-for="accreditedModule in accreditedModules" class="m-1">
                <AccreditedModuleBadge :accredited-module="accreditedModule"></AccreditedModuleBadge>
              </div>
            </div>
            </div>

            <button class="bg-gray-800 text-white py-1 px-2 rounded" type="button" @click="saveChanges">speichern</button>
          </div>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  Dialog,
  DialogPanel,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} from '@headlessui/vue';
import { AccreditedModule, Category, Module } from '../helpers/types';
import ModuleSearch from './ModuleSearch.vue';
import { store } from '../helpers/store';
import { StorageHelper } from '../helpers/storage-helper';
import AccreditedModuleBadge from './AccreditedModuleBadge.vue';

export default defineComponent({
  name: 'AccreditedModulesModal',
  components: {
    Dialog,
    DialogPanel,
    TabGroup,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    ModuleSearch,
    AccreditedModuleBadge
  },
  data() {
    return {
      modalIsOpen: false,
      accreditedModules: [] as AccreditedModule[],
      externalName: '',
      externalEcts: 0,
      externalCategories: [] as Category[],
      selectedModules: [] as Module[],
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
    onModuleSelected(moduleName: string) {
      const module = store.getters.modules.find(m => m.name === moduleName);
      if(module) {
        this.selectedModules.push(module);
      }
    },
    onCategoryClicked(category: Category) {
      if(this.externalCategories.includes(category)){
        this.externalCategories = this.externalCategories.filter(c => c.id !== category.id);
      } else {
        this.externalCategories.push(category);
      }
    },
    addExistingModule() {
      this.accreditedModules.push(...this.selectedModules.map(m => AccreditedModule.createFromExistingModule(m)));
      this.selectedModules = [];
    },
    addExternalEcts() {
      if(this.externalName && this.externalEcts && this.externalCategories.length) {
        this.accreditedModules.push(AccreditedModule.createFromExternalData(this.externalName, this.externalEcts, this.externalCategories.map(c => c.id)));
        this.externalName = '';
        this.externalEcts = 0;
        this.externalCategories = [];
      }
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

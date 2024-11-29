<template>
  <button class="h-6 w-16 bg-gray-800 text-white text-sm rounded" type="button" @click="openModal">+</button>

  <!-- todo: performance? -->
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
                  <div class="grid grid-rows-3">
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
                  <div class="grid grid-rows-2 grid-cols-2">
                    <div>
                      <label for="external-name" class="mr-1">Name</label>
                      <input id="external-name" class="border rounded" v-model="externalName">
                    </div>
                    <div>
                      <label for="external-ects" class="mr-1">ECTS</label>
                      <input id="external-ects" class="border rounded" v-model="externalEcts" type="number">
                    </div>
                    <div>
                      <label class="mr-1">Kategorien</label>
                      Dropdown
                    </div>
                  </div>
                  <div class="flex justify-end">
                    <button class="bg-gray-800 text-white py-1 px-2 rounded" type="button" @click="addExternalEcts">hinzufügen</button>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>

          <div class="mt-4" v-if="accreditedModules.length">
            <div>
              <span>Ausgewählte Module:</span>
              <ul>
                <li v-for="accreditedModule in accreditedModules">
                  <AccreditedModuleBadge :accredited-module="accreditedModule"></AccreditedModuleBadge>
                </li>
              </ul>
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
import { AccreditedModule, Module } from '../helpers/types';
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
      modalIsOpen: true,
      accreditedModules: [] as AccreditedModule[],
      externalName: '',
      externalEcts: 0,
      externalCategoryIds: [] as string[],
      selectedModules: [] as Module[],
    };
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
    addExistingModule() {
      this.accreditedModules.push(...this.selectedModules.map(m => new AccreditedModule(m.name, m.ects, m.categoriesForColoring)));
      this.selectedModules = [];
    },
    addExternalEcts() {
      console.log(this.externalName, this.externalEcts, this.externalCategoryIds);
      this.accreditedModules.push(new AccreditedModule(this.externalName, this.externalEcts, this.externalCategoryIds))
      this.externalName = '';
      this.externalEcts = 0;
      this.externalCategoryIds = [];
    },
    saveChanges() {
      // todo: validate, that no duplicates?
      store.commit('addAccreditedModules', this.accreditedModules);
      StorageHelper.updateUrlFragment()
      this.closeModal();
    },
  }
});
</script>

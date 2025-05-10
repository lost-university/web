import { store } from './store';
import { StorageHelper } from './storage-helper';

export function getPlanDataFromUrl() {
  const [semesters, accreditedModules, , validationEnabled] =
    StorageHelper.getDataFromUrlHash(
        window.location.hash,
        (semNum: number, moduleId: string) => {
            console.error(
            `Unknown module ${moduleId} encountered for semester ${semNum}`
            );
        }
    );

    store.commit('setValidationEnabled', validationEnabled);
    store.commit('setSemesters', semesters);
    store.commit('setAccreditedModules', accreditedModules);
}

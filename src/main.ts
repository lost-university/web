import { createApp } from 'vue';
import { clerkPlugin } from '@clerk/vue'

// import Font Awesome as Vue Component: Dynamic Icon Change does not work without it.
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library, type IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  faBars,
  faBookmark as fasBookmark,
  faChevronDown,
  faChevronUp,
  faCircleXmark,
  faCheck,
  faInfoCircle,
  faCircleExclamation,
  faCircleQuestion,
  faPlusCircle
} from '@fortawesome/free-solid-svg-icons';
import App from './App.vue';
import router from './router';
import { store } from './helpers/store';

library.add(faBars as IconDefinition);
library.add(fasBookmark, farBookmark as IconDefinition)
library.add(fasBookmark, farBookmark as IconDefinition)
library.add(faChevronUp as IconDefinition);
library.add(faChevronDown as IconDefinition);
library.add(faGithub as IconDefinition);
library.add(faCircleXmark as IconDefinition);
library.add(faCheck as IconDefinition);
library.add(faInfoCircle as IconDefinition);
library.add(faCircleExclamation as IconDefinition);
library.add(faCircleQuestion as IconDefinition);
library.add(faPlusCircle as IconDefinition);

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createApp(App)
  .use(router)
  .use(store)
  .use(clerkPlugin, { publishableKey: PUBLISHABLE_KEY })
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');

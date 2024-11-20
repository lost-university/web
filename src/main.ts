import { createApp } from 'vue';

// import Font Awesome as Vue Component: Dynamic Icon Change does not work without it.
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library, type IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faBars, faChevronDown, faChevronUp, faCircleXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import App from './App.vue';
import router from './router';

library.add(faBars as IconDefinition);
library.add(faChevronUp as IconDefinition);
library.add(faChevronDown as IconDefinition);
library.add(faGithub as IconDefinition);
library.add(faCircleXmark as IconDefinition);
library.add(faCheck as IconDefinition);

createApp(App).use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app');

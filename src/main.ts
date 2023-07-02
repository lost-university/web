import { createApp } from 'vue';
import '@fortawesome/fontawesome-free/css/all.css';
// eslint-disable-next-line import/extensions
import '@fortawesome/fontawesome-free/js/all.js';
import '../styles/main.scss';

// import Font Awesome as Vue Component: Dynamic Icon Change does not work without it.
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library, type IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import App from './App.vue';
import router from './router';

library.add(faChevronUp as IconDefinition);
library.add(faChevronDown as IconDefinition);

createApp(App).use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app');

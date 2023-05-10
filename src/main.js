import { createApp } from 'vue';
import '@fortawesome/fontawesome-free/css/all.css';
// eslint-disable-next-line import/extensions
import '@fortawesome/fontawesome-free/js/all.js';
import '../styles/main.scss';

// import Font Awesome as Vue Component: Dynamic Icon Change does not work without it.
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import router from './router';
import App from './App.vue';

library.add(faChevronUp);
library.add(faChevronDown);

createApp(App).use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app');

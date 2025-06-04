import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import SharingRedirect from "../views/SharingRedirect.vue";

const routes = [
  {
    path: '/shared/:slug',
    name: 'SharingRedirect',
    component: SharingRedirect
  },
  {
    path: '/:catchAll(.*)',
    name: 'Home',
    component: Home,
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

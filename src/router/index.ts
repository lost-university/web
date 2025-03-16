import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/graph',
    name: 'Graph',
    component: () => import('../views/Graph.vue'),
  },
  {
    path: '/overlay',
    name: 'Overlay',
    component: () => import('../views/Overlay.vue'),
  },
  {
    path: '/:catchAll(.*)',
    name: 'Home',
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

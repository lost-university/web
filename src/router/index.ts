import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import ModuleDependencyGraph from '../components/ModuleDependencyGraph.vue';

const routes = [
  {
    // path: '/:catchAll(.*)',
    path: '/:graph',
    name: 'Graph',
    component: ModuleDependencyGraph,
  },
  {
    path: '/:catchAll(.*)',
    name: 'Home',
    component: Home,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

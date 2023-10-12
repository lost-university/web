import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import ModuleDependencyPage from '../components/module-dependency-graph/ModuleDependencyPage.vue';

const routes = [
  {
    path: '/:graph',
    name: 'Graph',
    component: ModuleDependencyPage,
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

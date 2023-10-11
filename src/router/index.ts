import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import ModuleDependencyGraph from '../components/ModuleDependencyGraph.vue';

const routes = [
  // {
  //   path: '/:catchAll(.*)',
  //   name: 'Home',
  //   component: Home,
  // },
  {
    // path: '/graph',
    path: '/:catchAll(.*)',
    name: 'Graph',
    component: ModuleDependencyGraph
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

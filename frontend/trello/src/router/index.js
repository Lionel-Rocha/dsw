import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/Login.vue';
import Dashboard from '@/components/Dashboard.vue';
import ChangePassword from "@/components/ChangePassword.vue";

const routes = [
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Acesso negado. Faça login.');
        next('/login');
      } else {
        next();
      }
    },
  },
  {
    path: '/change-password',

    component: ChangePassword,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

import Board from '@/components/Board.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/board', component: Board },
  { path: '/change-password', component: ChangePassword },
];

export default router;

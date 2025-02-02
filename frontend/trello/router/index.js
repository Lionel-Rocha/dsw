import { createRouter, createWebHistory } from 'vue-router';
import Login from '../src/components/Login.vue';
import ChangePassword from "../src/components/ChangePassword.vue";
import UserBoards from "../src/components/UserBoards.vue";
import Board from "../src/components/Board.vue";
import Register from "../src/components/Register.vue";
import ResetPassword from "../src/components/ResetPassword.vue";
import ReallyResetPassword from "../src/components/ReallyResetPassword.vue";

const routes = [
    {path: '/', component: Login},
    {path: '/login', component: Login },
    {path: '/register', component: Register },
    {path: '/reset-password-challenge', component: ResetPassword},
    {path: '/reset-password', component: ReallyResetPassword},
    {path: '/change-password', component: ChangePassword, beforeEnter: (to, from, next) => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Acesso negado. Faça login.');
                next('/login');
            } else {
                next();
            }
        },
    },
    {path: '/user/boards', component: UserBoards, beforeEnter: (to, from, next) => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Acesso negado. Faça login.');
                next('/login');
            } else {
                next();
            }
        },
    },
    {path: '/board/:id', component: Board, beforeEnter: (to, from, next) => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Acesso negado. Faça login.');
                next('/login');
            } else {
                next();
            }
        },
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});



export default router;

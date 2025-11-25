import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../views/MainPage.vue';
import SignupPage from '../views/SignupPage.vue';

const routes = [
  { path: '/', name: 'home', component: MainPage },
  { path: '/signup', name: 'signup', component: SignupPage },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

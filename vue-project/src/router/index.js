import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../views/MainPage.vue';
import SignupPage from '../views/SignupPage.vue';
import LoginPage from '../views/LoginPage.vue';
import ContactsPage from '../views/ContactsPage.vue';

const routes = [
  { 
    path: '/', 
    name: 'home', 
    component: MainPage,
    meta: { requiresAuth: true }
  },
  { path: '/signup', name: 'signup', component: SignupPage },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/contacts', name: 'contacts', component: ContactsPage },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/loginView.vue';
import ChatView from '../views/chatView.vue';
import HomeView from '../views/homeView.vue';
import SettingView from '@/views/settingView.vue';
import RegisterView from '@/views/registerView.vue';
import GameListView from '@/views/gameListView.vue';

const routes = [
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/',
    name: 'Login',
    component: LoginView,
  },
  {
    path: "/chat/:gameId?",
    name: "Chat",
    component: ChatView,
    meta: { requiresAuth: true },
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true }, // 標記此路由需要登入
  },
  {
    path: '/setting',
    name: 'Setting',
    component: SettingView,
    meta: { requiresAuth: true }, // 標記此路由需要登入
  },
  {
    path: "/chat/history",
    name: "GameList",
    component: GameListView,
    meta: { requiresAuth: true },
  },
  // 捕獲所有未匹配的路由並重定向到首頁
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 導航守衛：在每次路由切換前執行
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('user-token');

  if (to.meta.requiresAuth && !isLoggedIn) {
    // 如果目標路由需要驗證且使用者未登入，則導向到登入頁
    next({ name: 'Login' });
  } else {
    // 否則，允許訪問
    next();
  }
});

export default router;


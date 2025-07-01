import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/loginView.vue';
import ChatView from '../views/chatView.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/',
    name: 'Chat',
    component: ChatView,
    meta: { requiresAuth: true }, // 標記此路由需要登入
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


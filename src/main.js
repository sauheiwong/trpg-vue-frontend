import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // 引入路由設定
import socket from './socket'

const bearerToken = localStorage.getItem("user-token");

if (bearerToken) {
  let pureToken = bearerToken;
  if (bearerToken.startsWith("Bearer ")){
    pureToken = bearerToken.substring(7);
  }
  socket.auth = { token: pureToken };
  socket.connect();
}

createApp(App)
  .use(createPinia())
  .use(router) // 告訴 Vue 使用路由
  .mount('#app') // 將應用掛載到 #app 元素上




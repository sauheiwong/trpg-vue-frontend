import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 引入路由設定

createApp(App)
  .use(router) // 告訴 Vue 使用路由
  .mount('#app') // 將應用掛載到 #app 元素上




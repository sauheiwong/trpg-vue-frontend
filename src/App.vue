<template>
  <div id="app-layout">
    <Sidebar :is-collapsed="isSidebarCollapsed" @toggle="toggleSidebar" />
    <div class="main-content">
      <ChatInterface />
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue';
import ChatInterface from './components/ChatInterface.vue';

export default {
  name: 'App',
  components: {
    Sidebar,
    ChatInterface,
  },
  data() {
    return {
      isSidebarCollapsed: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
  },
};
</script>

<style>
/* 全域佈局樣式 */
#app-layout {
  display: flex;
  height: 100vh; /* 讓佈局佔滿整個視窗高度 */
}
</style>

<style scoped>
.main-content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-width: 0; /* 防止內容過寬時 flex item 溢出 */
}
</style>

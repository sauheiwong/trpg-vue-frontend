<template>
  <div id="app-layout">
    <Sidebar :is-collapsed="isSidebarCollapsed" @toggle="toggleSidebar" @select-chat="getConversation" />
    <div class="main-content">
      <ChatInterface :messages="messages"/>
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
      messages: [
        { id: 1, content: '你好！我是 AI 模型。', role: 'assistant' },
        { id: 2, content: '嗨！我是一個問題。', role: 'user' },
        { id: 3, content: '系統訊息：對話已開始。', role: 'system' },
      ]
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    async getConversation(chatId){
      console.log("get conversation id is: ", chatId);
      // should be fetching data
      // fake data
      const fakeData = {
        "messages": [
          { id: 1, content: '系統訊息：新對話已開始。', role: 'system' },
          { id: 2, content: '嗨！我是一個新問題。', role: 'user' },
          { id: 3, content: '你好！我是 AI 模型。', role: 'assistant' },
        ]
      }
      this.messages = fakeData.messages
    }
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

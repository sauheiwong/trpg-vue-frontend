<template>
  <div id="chat-layout">
    <Sidebar 
    :is-collapsed="isSidebarCollapsed" 
    @toggle="toggleSidebar" 
    @select-chat="getConversation" 
    @logout="logout"
    />
    <div class="main-content">
      <ChatInterface :messages="messages" @send-message="sendMessage"/>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import ChatInterface from '../components/ChatInterface.vue';

export default {
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
          { id: Date.now(), content: '系統訊息：新對話已開始。', role: 'system' },
          { id: Date.now() + 1, content: '嗨！我是一個新問題。', role: 'user' },
          { id: Date.now() + 2, content: '你好！我是 AI 模型。', role: 'assistant' },
        ]
      }
      this.messages = fakeData.messages
    },
    async sendMessage(userMessage){
      this.messages.push({
        id: Date.now(),
        content: userMessage,
        role: "user",
      })

      this.messages.push({
        id: Date.now() + 1,
        content: "loading...",
        role: "assistant",
      })

      await new Promise(res => setTimeout(res, 500)) // 模擬網路延遲 
      const aiResponse = {
        message: `這是對「${userMessage}」的 AI 回覆。`
      }

      this.messages[this.messages.length - 1].content = aiResponse.message
    },
    logout() {
        localStorage.removeItem("user-token");
        this.$router.push("/login")
    }
  },
};
</script>

<style scoped>

#chat-layout {
  display: flex;
  height: 100vh; /* 讓佈局佔滿整個視窗高度 */
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-width: 0; /* 防止內容過寬時 flex item 溢出 */
}
</style>


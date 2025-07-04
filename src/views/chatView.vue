<template>
  <div id="chat-layout">
    <Sidebar 
    :is-collapsed="isSidebarCollapsed" 
    @toggle="toggleSidebar" 
    @select-chat="getConversation" 
    @logout="logout"
    />
    <div class="main-content">
      <ChatInterface :title="title" :messages="messages" @send-message="sendMessage"/>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import ChatInterface from '../components/ChatInterface.vue';
import apiClient from '../api';

export default {
  components: {
    Sidebar,
    ChatInterface,
  },
  data() {
    return {
      isSidebarCollapsed: false,
      title: "New Conversation",
      messages: [],
      isNewConversation: true,
      conversationId: "",
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    async getConversation(conversationId){
      console.log("get conversation id is: ", conversationId);
      // should be fetching data
      // fake data
      const fakeData = {
        "messages": [
          { id: Date.now(), content: 'system message: a new chat start', role: 'system' },
          { id: Date.now() + 1, content: 'I am a new message from user ', role: 'user' },
          { id: Date.now() + 2, content: 'Hello, I am new AI chat message。', role: 'assistant' },
        ]
      }
      this.messages = fakeData.messages
    },
    // test message: 你知道初音未來嗎?
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

      try{ 
        console.log("fetch start");

        let response;

        if (this.isNewConversation){
          response = await apiClient.post(`/test/chat/`, {
          message: userMessage,
        });
          this.conversationId = response.data.conversationId
        } else {
          response = await apiClient.post(`/test/chat/${this.conversationId}`, {
          message: userMessage,
        });
        }

        this.messages[this.messages.length - 1].content = response.data.modelMessage;

      } catch (err){
        this.messages[this.messages.length - 1].content = err.response?.data?.message || "fetch fail or server error"
      }
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


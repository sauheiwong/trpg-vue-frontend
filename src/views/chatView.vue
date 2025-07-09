<template>
  <div id="chat-layout">
    <Sidebar 
    :is-collapsed="isSidebarCollapsed"
    :conversations="conversations"
    @toggle="toggleSidebar"
    @new-chat="newChat" 
    @select-chat="getConversation" 
    @logout="logout"
    />
    <div class="main-content">
      <ChatInterface 
      :title="title" 
      :messages="messages" 
      @send-message="sendMessage"
      @update-title="updateTitle"
      />
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
      conversations: [],
    };
  },
  created() {
    this.fetchConversations();
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    newChat() {
      this.title = "New chat";
      this.messages = [];
      this.isNewConversation = true;
      this.conversationId = `new-${Date.now()}`
    },
    async fetchConversations() {
      try{
        console.log("fetch conversation start");
        const response = await apiClient.get("/chat");
        console.log("response is: ", response);
        this.conversations = response.data.conversations;
      } catch (err){
        console.error("fetch conversation error is: ", err)
        this.conversations = [{title: "error", updatedAt: Date.now()}]
      }
    },
    async getConversation(conversationId){
      console.log("get conversation id is: ", conversationId);
      try{
        const response = await apiClient.get(`/chat/${conversationId}`);
        console.log("response.data is: ", response.data);
        this.title = response.data.title;
        this.messages = response.data.messages;
        this.conversationId = conversationId;
        this.isNewConversation = false;
      } catch (err){
        this.title = `Error⚠️: ${err}`;
        this.messages = [];
      }
    },
    async sendMessage(userMessage){
      if (this.isNewConversation){
        this.messages = []
      }
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
          this.conversationId = response.data.conversationId;
          this.isNewConversation = false;
          await this.fetchConversations();
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
    async updateTitle(newTitle) {
      if (this.isNewConversation) return;
      try{
        console.log("conversation id is: ", this.conversationId)
        await apiClient.put(`/chat/${this.conversationId}`, {title: newTitle});
        const conversationInList = this.conversations.find(c => c._id === this.conversationId)
        if (conversationInList){
          conversationInList.title = newTitle
        }
      } catch (err){
        this.title = `Error⚠️: ${err}`;
      }
    },
    logout() {
        localStorage.removeItem("user-token");
        this.$router.push("/login")
    }
  }
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


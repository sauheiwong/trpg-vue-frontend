<script setup>
import { useHistoryStore } from '@/stores/historyStore';

const historyStore = useHistoryStore();
</script>

<template>
  <div id="chat-layout">
    <Sidebar 
    :is-collapsed="isSidebarCollapsed"
    @toggle="toggleSidebar"
    @delete-chat="deleteConversation"
    @logout="logout"
    />
    <div class="main-content">
      <ChatInterface 
      :title="historyStore.title" 
      :messages="historyStore.messages" 
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
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    async updateTitle(newTitle) {
      if (this.isNewConversation) return;
      try{
        await apiClient.put(`/chat/${this.conversationId}`, {title: newTitle});
        const conversationInList = this.conversations.find(c => c._id === this.conversationId)
        if (conversationInList){
          conversationInList.title = newTitle
        }
      } catch (err){
        this.title = `Error⚠️: ${err}`;
      }
    },
    async deleteConversation(conversationId) {
      try{
        await apiClient.delete(`/chat/${conversationId}`);
        
        this.conversations = this.conversations.filter(conversation => conversation._id !== conversationId)

        if (this.conversationId === conversationId) {
          this.newChat()
        }
      } catch (err){
        console.error("Error deleting conversation:", err);
        this.title = `Error⚠️: Could not delete conversation.`;
        this.messages = [];
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

a {
  color: var(--text-color)
}
</style>


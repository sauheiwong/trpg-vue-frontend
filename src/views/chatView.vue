<script setup>
import { useHistoryStore } from '@/stores/historyStore';

const historyStore = useHistoryStore();
</script>

<template>
  <div id="chat-layout">
    <Sidebar 
    :is-collapsed="isSidebarCollapsed"
    @toggle="toggleSidebar"
    @delete-chat="deleteGame"
    @logout="logout"
    />
    <div class="main-content">
      <ChatInterface />
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
    async deleteGame(gameId) {
      try{
        await apiClient.delete(`/chat/${gameId}`);
        
        this.games = this.games.filter(game => game._id !== gameId)

        if (this.gameId === gameId) {
          this.newChat()
        }
      } catch (err){
        console.error("Error deleting game:", err);
        this.title = `Error⚠️: Could not delete game.`;
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


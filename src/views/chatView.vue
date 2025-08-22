<template>
  <div id="chat-layout">
    <Sidebar 
    :is-collapsed="isSidebarCollapsed"
    @toggle="toggleSidebar"
    @logout="logout"
    :isCOC="true"
    />
    <div class="main-content">
      <ChatInterface />
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import ChatInterface from '../components/ChatInterface.vue';
import { useHistoryStore } from '@/stores/historyStore';
import { mapActions } from 'pinia';

export default {
  components: {
    Sidebar,
    ChatInterface,
  },
  data() {
    return {
      isSidebarCollapsed: true,
    };
  },
  created() {
    this.checkGameStatus();
  },  
  methods: {
    ...mapActions(useHistoryStore, ["newGame", "selectGame"]),
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    async checkGameStatus() {
      const gameId = this.$route.params.gameId;

      if (gameId) {
        console.log("load game with id: ", gameId);
        await this.selectGame(gameId)
      } else {
        console.log("new game start")
        const newGameId = await this.newGame();

        if (newGameId) {
          this.$router.push({
            name: "Chat",
            params: { gameId: newGameId }
          })
        }
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


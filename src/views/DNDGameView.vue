<template>
  <div id="chat-layout">
    <Sidebar 
    :is-collapsed="isSidebarCollapsed"
    @toggle="toggleSidebar"
    @logout="logout"
    :isCOC="false"
    />
    <div class="main-content">
      <DNDGameInterface />
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import DNDGameInterface from '@/components/DNDGameInterface.vue';
import { useDNDStore } from '@/stores/DNDGameStore';
import { mapActions } from 'pinia';

export default {
  components: {
    Sidebar,
    DNDGameInterface,
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
    ...mapActions(useDNDStore, ["newGame", "selectGame"]),
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
            name: "DNDGameView",
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


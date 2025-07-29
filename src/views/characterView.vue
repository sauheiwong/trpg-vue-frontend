<template>
  <div id="chat-layout">
    <Sidebar 
    :is-collapsed="isSidebarCollapsed"
    @toggle="toggleSidebar"
    @logout="logout"
    />
    <div class="main-content">
      <CharacterCreate />
      
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import CharacterCreate from '@/components/CharacterCreate.vue';

import { useCharacterStore } from '@/stores/characterStore';
import { mapActions } from 'pinia';

export default {
  components: {
    Sidebar,
    CharacterCreate,
  },
  data() {
    return {
      isSidebarCollapsed: true,
    };
  },
  created() {
    this.checkCharacterStatus();
  },  
  methods: {
    ...mapActions(useCharacterStore, ["newChat", "selectChat"]),
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    async checkCharacterStatus() {
      const chatId = this.$route.params.chatId;

      if (chatId) {
        console.log("load character with id: ", chatId);
        await this.selectChat(chatId)
      } else {
        console.log("new character start")
        const newChatId = await this.newChat();
        this.$router.push({
            name: "CreateCharacterView",
            params: { chatId: newChatId }
          })
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


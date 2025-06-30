<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <button @click="toggleSidebar" class="toggle-btn">
      {{ isCollapsed ? '›' : '‹' }}
    </button>
    <div v-if="!isCollapsed" class="sidebar-content">
      <h3>聊天歷史</h3>
      <ul>
        <li v-for="conversation in conversations" :key="conversation.id" @click="selectConversation(conversation.id)">{{ conversation.title }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    isCollapsed: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    toggleSidebar() {
      this.$emit('toggle');
    },
    selectConversation(chatId){
      console.log("select conversation id is: ", chatId)
      this.$emit("select-chat", chatId)
    }
  },
  data(){
    return {
      conversations: [
        {id: "chat-1", title: "Conversation 1"},
        {id: "chat-2", title: "Conversation 2"},
      ]
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: black;
  transition: width 0.3s ease;
  flex-shrink: 0; /* 防止側邊欄在視窗縮小時被壓縮 */
  position: relative;
  overflow-x: hidden; /* 收合時隱藏溢出的內容 */
  box-sizing: border-box;
  border-right: 1px solid #ddd;
}

.sidebar-content {
  margin-top: 40px;
}

.sidebar-content h3 {
  margin-bottom: 10px;
}

.sidebar-content ul {
  list-style: none;
  padding: 0;
}

.sidebar-content li {
  color: var(--text-color);
  background-color: var(--background-color);
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: var(--fast-transition);
  display: flex;
  justify-content: center;
  margin: 10px 0px;
  font-size: large;
}

.sidebar-content li:hover {
  background-color: var(--highlight1-color);
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-content {
  padding: 20px;
}

.toggle-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 30px;
  height: 30px;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  background-color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.sidebar.collapsed .toggle-btn {
  /* 在收合時將按鈕置中 */
  left: 50%;
  right: auto; /* 移除右側定位以避免衝突 */
  transform: translateX(-50%);
}
</style>

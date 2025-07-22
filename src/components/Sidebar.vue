<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <button @click="toggleSidebar" class="toggle-btn">
      {{ isCollapsed ? '›' : '‹' }}
    </button>
    <div v-if="!isCollapsed" class="sidebar-content">
      <router-link to="/home" class="home-link">Home</router-link>
      <button @click="logout" class="logout-btn">Logout</button>
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
    logout(){
      this.$emit("logout");
    }
  },
  data(){
    return {
    }
  }
};
</script>

<style scoped>

.new-chat-btn{
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  background-color: var(--highlight2-color, #444);
  color: var(--text-color);
  border: 1px solid var(--highlight1-color);
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: var(--fast-transition);
}

.new-chat-btn:hover {
  background-color: var(--highlight1-color);
}

.home-link{
  color: var(--text-color);
  font-size: 40px;
}

.logout-btn {
  background-color: #f44336; /* 紅色 */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
  min-height: 100%;
  width: 100%;
  padding: 10px;
  margin-top: auto; /* 將按鈕推到最下方 */
}

.logout-btn:hover ,.sidebar-content button:hover {
  background-color: #d32f2f;
}

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

.game-group{
  background-color: rgba(20, 20, 20);
  padding: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
}

.group-label{
  color: var(--text-color);
  font-size: x-large;
  text-decoration: underline;
}

.sidebar-content ul {
  list-style: none;
  padding: 0;
}

.sidebar-content li {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.sidebar-content li.active {
  background-color: var(--highlight2-color);
  font-weight: bold;
}

.sidebar-content li button {
  width: 20%;
  padding: 10px;
  background-color: #f44336; /* 紅色 */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
  min-height: 100%;
}

.sidebar-content p {
  color: var(--text-color);
  background-color: var(--background-color);
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: var(--fast-transition);
  display: flex;
  justify-content: center;
  margin: 0 5px 0 0;
  font-size: medium;
  width: calc(80% - 5px);
}

.sidebar-content p:hover {
  background-color: var(--highlight1-color);
}

.sidebar.collapsed {
  .sidebar-content li {
    display: block; /* Ensure vertical layout for collapsed state */
    margin-bottom: 0; /* Remove bottom margin for collapsed state */
  }

  .sidebar-content button {
    width: 100%; /* Full width buttons in collapsed state */
    margin-top: 5px; /* Add some space between items */
  }
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

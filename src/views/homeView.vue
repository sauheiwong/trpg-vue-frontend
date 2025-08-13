<template>
  <div id="chat-layout">
    <div class="main-content">
        <h2>Welcome</h2>
        <div class="option-container">
            <Option 
            v-for="option in options"
            :key="option.id"
            :title="option.title"
            :to="option.to"
        />
        </div>
        <div class="logout-container"><button @click="logout" class="logout-btn">Logout</button></div>
    </div>
  </div>
</template>

<script>
import Option from '../components/Option.vue';

export default {
    name: "HomeView",
    components: {
        Option,
    },
    methods: {
      logout() {
        localStorage.removeItem("user-token");
        this.$router.push("/login")
      }
    },
    data(){
        return {
            options: [
                {id: "option-1", title: "New Game", to: "/game"},
                {id: "option-2", title: "Game Recording", to: "/game"},
                {id: "option-3", title: "Setting", to: "/setting"},
            ]
        }
    }

}

</script>

<style scoped>

#chat-layout {
  display: flex;
  height: 100vh; /* 讓佈局佔滿整個視窗高度 */
  justify-content: center;
  align-items: center;
}

h2{
    border-bottom: 1px solid white;
}

.main-content {
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 50%;
  width: 80%;
  gap: 15px;
  padding: 40px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: var(--background-color);
  font-size: x-large;
}

.option-container{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
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

</style>
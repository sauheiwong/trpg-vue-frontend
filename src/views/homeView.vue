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
    data(){
        return {
            options: [
                {id: "option-1", title: "New Chat", to: "/chat"},
                {id: "option-2", title: "Chat History", to: "/"},
                {id: "option-3", title: "Setting", to: "/"},
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

</style>
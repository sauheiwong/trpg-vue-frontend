<template>
  <div class="chat-interface">
    <div class="messages-container">
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :message="message"
      />
    </div>
    <div class="input-area">
      <input type="text" v-model="userMessage" placeholder="在這裡輸入訊息..." />
      <button @click="sendMessage">發送</button>
    </div>
  </div>
</template>

<script>
import ChatMessage from './ChatMessage.vue';

export default {
  name: 'ChatInterface',
  components: {
    ChatMessage,
  },
  data() {
    return {
      messages: [
        { id: 1, content: '你好！我是 AI 模型。', role: 'assistant' },
        { id: 2, content: '嗨！我是一個問題。', role: 'user' },
        { id: 3, content: '系統訊息：對話已開始。', role: 'system' },
      ].reverse(),
      userMessage: "",
    };
  },
  methods: {
    async sendMessage(){
      this.messages.push({
        id: this.messages.length,
        content: this.userMessage,
        role: "user"
      })
      // fetch("http://localhost:4000/test/chat/685da04ea95ae213d4348b0b", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({ message: this.userMessage })
      // })
      // .then(response => {
      //   if(!response.ok){
      //     return response.json().then(errorData => {
      //       throw new Error(`HTTP Error. status: ${response.status}, message: ${errorData.message || 
      //       "server error"}`)
      //     })
      //   }
      //   return response.json()
      // })
      // .then(data => {
      //   this.userMessage = ""
      //   this.messages.push({
      //     id: this.messages.length,
      //     content: data.message,
      //     role: "assistant"
      //   })
      // })
      // .catch(error => {
      //   console.error("fetch fail: ", error);
      // })
      const data = {
        message: "test"
      }
      this.userMessage = ""
      this.messages.push({
        id: this.messages.length,
        content: data.message,
        role: "assistant"
      })
    }
  }
};
</script>

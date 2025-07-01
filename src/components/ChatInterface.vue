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
  props: {
    messages: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      userMessage: "",
    };
  },
  methods: {
    sendMessage(){
      if(!this.userMessage.trim()){
        return;
      }
      this.$emit("send-message", this.userMessage)
      this.userMessage = ""
    }
  }
};
</script>

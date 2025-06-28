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
      <input type="text" placeholder="在這裡輸入訊息..." />
      <button>發送</button>
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
        { id: 1, text: '你好！我是 AI 模型。', sender: 'ai' },
        { id: 2, text: '嗨！我是一個問題。', sender: 'user' },
        { id: 3, text: '系統訊息：對話已開始。', sender: 'system' },
      ],
    };
  },
};
</script>

<script setup>
import { ref, nextTick, watch } from "vue";
import { useCharacterStore } from '@/stores/characterStore';
import ChatMessage from "./ChatMessage.vue";

const characterStore = useCharacterStore();

const messageContainerRef = ref(null);

watch(
  () => characterStore.messages,
  () => {
    nextTick(() => {
      const container = messageContainerRef.value;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  },
  { deep: true }
)

</script>

<template>
  <div class="chat-interface">
    <div class="chat-title-container">
      <h1 class="title">
        {{ characterStore.title || "Create a new character" }}
      </h1>
    </div>
    <div class="messages-container" ref="messageContainerRef">
      <ChatMessage
        v-for="message in characterStore.messages"
        :key="message._id"
        :message="message"
      />
    </div>
    <div class="input-area">
      <textarea type="text" v-model="characterStore.userMessage" @keydown.enter.exact.prevent="characterStore.sendMessage" placeholder="Enter your message"></textarea>
      <button @click="characterStore.sendMessage()">Send</button>
    </div>
  </div>
</template>

<style scoped>

.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-title-container {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.title {
  padding-right: 30px;
  margin: 0;
  font-size: 1.5rem;
}

.input-area {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.input-area textarea {
  background-color: var(--highlight1-color);
  color: var(--text-color);
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 18px;
  margin-right: 1rem;
}

.input-area textarea:focus {
  outline: none;
}

.input-area button {
  padding: 0.75rem 1.5rem;
  border: none;
  background-color: var(--highlight2-color);
  transition: 0.5s ease-in-out;
  color: white;
  border-radius: 20px;
  cursor: pointer;
}

.input-area button:hover {
  background-color: var(--tips-color);
  color: black
}

</style>

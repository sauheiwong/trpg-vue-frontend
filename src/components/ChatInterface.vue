<script setup>
import { ref, nextTick, watch } from "vue";
import { useHistoryStore } from '@/stores/historyStore';
import ChatMessage from "./ChatMessage.vue";

const historyStore = useHistoryStore();

const editingTitle = ref('');
const titleInput = ref(null);

const startEditing = () => {
  editingTitle.value = historyStore.title;
  historyStore.startEditTitle();
  nextTick(() => {
    titleInput.value?.focus();
  })
}

const saveTitle = () => {
  historyStore.editTitle(editingTitle.value);
}

const messageContainerRef = ref(null);

watch(
  () => historyStore.messages,
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
      <h1 v-if="!historyStore.isEditingTitle" @click="startEditing" class="editable-title">
        {{ historyStore.title }}
        <span class="edit-icon">✏️</span>
      </h1>
      <input
        v-else
        ref="titleInput"
        v-model="editingTitle"
        @blur="saveTitle"
        @keyup.enter="saveTitle"
        class="title-input"
      />
    </div>
    <div class="messages-container" ref="messageContainerRef">
      <ChatMessage
        v-for="message in historyStore.messages"
        :key="message._id"
        :message="message"
      />
    </div>
    <div class="input-area">
      <textarea type="text" v-model="historyStore.userMessage" @keydown.enter.exact.prevent="historyStore.sendMessage" placeholder="Enter your message"></textarea>
      <button @click="historyStore.sendMessage()">Send</button>
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

.editable-title {
  cursor: pointer;
  padding-right: 30px;
  margin: 0;
  font-size: 1.5rem;
}

.editable-title .edit-icon {
  display: inline-block;
  opacity: 0.5;
  transition: opacity 0.2s ease-in-out;
  font-size: 0.8em;
  margin-left: 8px;
}

.editable-title:hover .edit-icon{
  opacity: 1;
}

.title-input {
  font-size: 1.5em;
  font-weight: bold;
  border: none;
  border-bottom: 2px solid var(--highlight1-color);
  background-color: transparent;
  color: var(--text-color);
  width: 100%;
  box-sizing: border-box;
}

.title-input:focus {
  outline: none;
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

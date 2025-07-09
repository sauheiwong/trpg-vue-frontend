<template>
  <div class="chat-interface">
    <div class="chat-title-container">
      <h1 v-if="!isEditingTitle" @click="startEditingTitle" class="editable-title">
        {{ currentTitle }}
        <span class="edit-icon">✏️</span>
      </h1>
      <input
        v-else
        ref="titleInput"
        v-model="currentTitle"
        @blur="finishEditingTitle"
        @keyup.enter="finishEditingTitle"
        class="title-input"
      />
    </div>
    <div class="messages-container">
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :message="message"
      />
    </div>
    <div class="input-area">
      <input type="text" v-model="userMessage" @keyup.enter="sendMessage" placeholder="Enter your message" />
      <button @click="sendMessage">Send</button>
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
    },
    title: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      userMessage: "",
      isEditingTitle: false,
      currentTitle: this.title,
    };
  },
  watch: {
    title(newTitle) {
      this.currentTitle = newTitle
    }
  },  
  methods: {
    sendMessage() {
      if(!this.userMessage.trim()){
        return;
      }
      this.$emit("send-message", this.userMessage)
      this.userMessage = ""
    },
    startEditingTitle() {
      this.isEditingTitle = true;
      this.$nextTick(() => {
        this.$refs.titleInput.focus();
      })
    },
    finishEditingTitle() {
      this.isEditingTitle = false;
      const newTitle = this.currentTitle.trim();

      if (!newTitle || newTitle === this.title) {
        this.currentTitle = this.title;
        return;
      }

      this.$emit("update-title", newTitle);
    }
  }
};
</script>

<style scoped>

.chat-title-container {
  position: relative;
  margin-bottom: 1rem;
}

.editable-title {
  cursor: pointer;
  padding-right: 30px;
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
  font-size: 2em;
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

</style>

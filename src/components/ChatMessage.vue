<template>
  <div :class="['chat-message', message.role]">
    <div class="avatar" :class="message.role">
      <span v-if="message.role === 'user'">🧑</span>
      <span v-else-if="message.role === 'model'">🤖</span>
      <span v-else>⚙️</span>
    </div>
    <div class="message-content-wrapper">
      <div class="message-content" v-html="renderedContent"></div>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default {
  name: 'ChatMessage',
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  computed: {
    renderedContent() {
      if (this.message.content === "loading...") {
        return '<div class="loading-dots"><div></div><div></div><div></div></div>'
      }
      const rawHtml = marked(this.message.content, { gfm: true, breaks: true });
      const sanitizedHtml = DOMPurify.sanitize(rawHtml);
      return sanitizedHtml;
    }
  },
};
</script>

<style scoped>

.chat-message {
  display: flex;
  margin-bottom: 15px;
  align-items: flex-start;
  max-width: 90%;
}

.chat-message.user{
  flex-direction: row-reverse;
  margin-left: auto;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  margin: 0 10px;
  background-color: var(--background-color);
  border: 1px solid var(--highlight1-color);
}

.message-content-wrapper {
  /* background-color: var(--highlight1-color); */
  border-radius: 10px;
  padding: 5px 10px;
  color: var(--text-color);
  word-wrap: break-word;
}

.chat-message.user .message-content-wrapper {
  background-color: var(--highlight1-color);
}

:deep(.message-content pre) {
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

:deep(.message-content code) {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 2px 4px;
  border-radius: 3px;
}

:deep(.message-content pre > code) {
  background-color: transparent;
  padding: 0;
}

:deep(.message-content ul),
:deep(.message-content ol) {
  padding-left: 25px;
}

:deep(.message-content p) {
  margin: 0.5rem 0;
}

.loading-dots { display: flex; align-items: center; justify-content: center; height: 24px; }
.loading-dots div { width: 8px; height: 8px; background-color: var(--text-color); border-radius: 50%; margin: 0 4px; animation: bounce 1.4s infinite ease-in-out both; }
.loading-dots div:nth-child(1) { animation-delay: -0.32s; }
.loading-dots div:nth-child(2) { animation-delay: -0.16s; }
@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }

</style>

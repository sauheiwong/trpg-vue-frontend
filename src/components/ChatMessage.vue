<template>
  <div class="chat-message" :class="messageClass">
    <p>{{ message.content }}</p>
  </div>
</template>

<script>
export default {
  name: 'ChatMessage',
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  computed: {
    messageClass() {
      return `message-${this.message.role}`;
    },
  },
};
</script>

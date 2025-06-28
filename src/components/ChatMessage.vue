<template>
  <div class="chat-message" :class="messageClass">
    <p>{{ message.text }}</p>
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
      return `message-${this.message.sender}`;
    },
  },
};
</script>

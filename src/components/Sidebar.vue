<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <button @click="toggleSidebar" class="toggle-btn">
      {{ isCollapsed ? '›' : '‹' }}
    </button>
    <div v-if="!isCollapsed" class="sidebar-content">
      <h3>聊天歷史</h3>
      <ul>
        <li>對話 1</li>
        <li>對話 2</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    isCollapsed: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    toggleSidebar() {
      this.$emit('toggle');
    },
  },
};
</script>

<template>
  <div
    v-if="Object.keys(selectedTextChannel).length === 0"
    class="message-list"
  >
    <div class="empty-message-placeholder">
      <i
        class="pi pi-comments"
        style="font-size: 2rem; margin-bottom: 8px; color: #888"
      />
      <p>Please select a text channel to view messages.</p>
    </div>
  </div>

  <div v-else ref="messageContainerRef" class="scrollable-message-list">
    <div id="message-list-id" class="message-list">
      <div
        v-for="message in props.messageList"
        :key="message._id"
        class="message-item"
      >
        <div class="message-item-data">
          {{ message.senderId.email }}
          <span style="font-size: 0.7rem; color: var(--text-color-tertiary)">
            {{ formatMessageTime(message.createdAt) }}</span
          >
        </div>
        <div class="message-item-content">{{ message.messageBody }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatMessageTime } from "~/utils/utils";

const props = defineProps({
  messageList: { type: Array, required: true },
  selectedTextChannel: { type: Object, required: true },
});

const messageContainerRef = ref(null);

const scrollToBottom = () => {
  nextTick(() => {
    const el = messageContainerRef?.value;
    if (!el) return;

    const shouldScroll = el.scrollHeight - el.scrollTop - el.clientHeight < 100; 

    if (shouldScroll) {
      el.scrollTop = el.scrollHeight;
    }
  });
};

onMounted(() => {
  scrollToBottom();
});

watch(() => props.messageList.length, scrollToBottom);
</script>

<style scoped>
.scrollable-message-list {
  flex: 1;
  justify-content: center;
  overflow-y: auto;
  padding-right: 8px;
}

.message-list {
  flex: 1;
  overflow-y: hidden;
  padding: 8px 16px;
}

.message-item {
  display: flex;
  flex-direction: column;
  gap: 4px;

  width: 100%;

  padding: 8px 0;
}

.message-item-data {
  color: var(--text-color-fill);
  font-size: 1.05rem;
  font-weight: bold;
}

.message-item-content {
  color: var(--text-color);
  font-size: 1rem;
  word-break: break-all;
}
</style>

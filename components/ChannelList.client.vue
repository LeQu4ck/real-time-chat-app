<template>
  <div>
    <div class="channels-list">
      <div
        v-for="channel in channelList"
        :key="channel._id"
        class="channel-bubble"
      >
        <i class="pi pi-megaphone" />
        <span>{{ channel.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { socket } from "./sockets";

const channelList = ref([]);

const fetchChannels = async () => {
  channelList.value = await fetch(
    "http://localhost:3000/api/channel/channel-all"
  )
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching channels:", error);
      return [];
    });
};

const onNewChannel = (channel) => {
  channelList.value.unshift(channel);
};

onMounted(() => {
  fetchChannels();
});

socket.on("channel:new", onNewChannel);

onBeforeUnmount(() => {
  socket.off("channel:new", onNewChannel);
});
</script>

<style scoped>
.channels-list {
  display: flex;
  flex-direction: row;
  align-items: center;

  gap: 24px;
}

.channel-bubble {
  display: flex;

  justify-content: center;
  align-items: center;
  padding: 8px 12px;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  background-color: #2d272f;
  gap: 8px;

  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  transition: all 0.2s ease-in-out;
}

.channel-bubble:hover {
  background-color: #3c3535;
  transform: scale(1.06);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
</style>

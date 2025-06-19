<template>
  <div class="wrapper">
    <ChannelList
      @show-toast="showToast"
      @selected-channel="openSelectedChannel"
    />
    <div v-if="Object.keys(currentChannel).length > 0" class="content">
      <div class="channel-info-area">
        <div class="channel-description">
          <h3>{{ currentChannel?.name }}</h3>
          <p>{{ currentChannel?.description }}</p>
        </div>

        <div class="text-channels-area">
          <h3>Text channels</h3>
          <div class="text-channels">
            <div
              v-for="txt in textChannels"
              :key="txt?._id"
              class="text-channel"
              @click="openSelectedTextChannel(txt?._id)"
            >
              <i class="pi pi-receipt" style="margin-right: 16px" />
              {{ txt?.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="messages-area">
        <div class="text-channel-info">bara info text-channel</div>
        <div class="text-channel-messages">
          <div class="message-list">messages</div>

          <div class="text-input-area">
            <InputGroup>
              <InputText
                v-model="textMessageContent"
                placeholder="Text here"
                name="textMessageContent"
              />
              <InputGroupAddon>
                <PrimevueBtn icon="pi pi-send" severity="secondary" />
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      </div>
      <div class="channel-members-area">
        <div class="members-description">
          <h3>Members</h3>
          <p>1 Online</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PrimevueBtn from "primevue/button";

definePageMeta({
  middleware: ["auth"],
});

const emit = defineEmits(["show-toast"]);

const showToast = (toastProps) => {
  emit("show-toast", toastProps);
};

const textMessageContent = ref(null);

const currentChannel = ref({});
const channelInfo = async (channelId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/channel/${channelId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();
    currentChannel.value = data.channel || {};

    console.log("Current channel:", currentChannel.value);
  } catch {
    console.error("Error fetching channel info");
  }
};
const textChannels = ref();
const getChannelTextChannels = async (channelId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/text-channels/${channelId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    textChannels.value = data.textChannels || [];
  } catch {
    console.error("Error fetching channel");
  }
};

const openSelectedTextChannel = (textChannelId) => {
  console.log("Selected text channel ID:", textChannelId);
};

const openSelectedChannel = async (channelId) => {
  await channelInfo(channelId);
  await getChannelTextChannels(channelId);
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;

  gap: 24px;
  /* align-items: center;
  justify-content: center; */
  height: calc(100vh - 72px);
  background: linear-gradient(145deg, #2a2430, #201c24);
  margin-top: 4px;
  overflow-x: hidden;
}

.content {
  display: flex;
  flex-direction: row;

  justify-content: center;
  height: 100%;
  color: #fff;
}

.channel-info-area {
  flex-grow: 1;
  border-right: #3c3c44 1px solid;
  border-top: #3c3c44 1px solid;

  padding: 16px;
}

.channel-description {
  border-bottom: #fff 1px solid;
}

.text-channels-area {
  color: #c3c3bb;
}

.text-channels {
  display: flex;
  flex-direction: column;

  gap: 8px;
}

.text-channel {
  display: flex;
  flex-direction: row;
  align-items: center;

  padding: 4px;

  border-radius: 4px;

  cursor: pointer;
}

.text-channel:hover {
  background-color: #3c3c44;
}

.text-channel-info {
  border-bottom: #3c3c44 1px solid;
  padding: 16px;
}

.text-channel-messages {
  display: flex;
  flex-direction: column;
  height: 90%;
  overflow: hidden;

  padding: 16px;
}

.message-list {
  flex: 1;
  overflow-y: auto;
}

.text-input-area {
  background-color: #1e1b22;
}

.messages-area {
  flex-grow: 8;
  border-top: #3c3c44 1px solid;
  border-right: #3c3c44 1px solid;
}

.channel-members-area {
  flex-grow: 1;
  border-top: #3c3c44 1px solid;
  padding: 16px;
}

.members-description {
  border-bottom: #fff 1px solid;
}
</style>

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
              @click="openSelectedTextChannel(txt)"
            >
              <i class="pi pi-receipt" />
              {{ txt?.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="messages-area">
        <div class="text-channel-info">
          <i v-if="selectedTextChannel?.name" class="pi pi-receipt" />
          {{
            selectedTextChannel?.name
              ? selectedTextChannel?.name
              : "Select a text channel"
          }}
        </div>
        <div class="text-channel-messages">
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

          <div v-else class="message-list">aa</div>

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
        <div class="members-list">
          <div
            v-for="(members, role) in channelMembers"
            :key="role"
            class="member-group"
          >
            <h4 class="member-role">{{ role.toUpperCase() }}</h4>

            <div
              v-for="member in members"
              :key="member._id"
              class="member-item"
            >
              <div>
                <i class="pi pi-user" /> <span>{{ member.email }}</span>
              </div>

              <span> {{ member.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PrimevueBtn from "primevue/button";
import { socket } from "~/components/sockets";

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
    const response = await $fetch(
      `http://localhost:3000/api/channel/${channelId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    currentChannel.value = response.channel || {};

    //console.log("Current channel:", currentChannel.value);
  } catch {
    console.error("Error fetching channel info");
  }
};
const textChannels = ref();
const getChannelTextChannels = async (channelId) => {
  try {
    const response = await $fetch(
      `http://localhost:3000/api/text-channels/${channelId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    textChannels.value = response.textChannels || [];

    selectedTextChannel.value = textChannels.value[0] || {};
  } catch {
    console.error("Error fetching channel");
  }
};

const selectedTextChannel = ref({});
const openSelectedTextChannel = (textChannel) => {
  console.log("Selected text channel ID:", textChannel);
  selectedTextChannel.value = textChannel;
};

const channelMembers = ref({});
const fetchChannelMembers = async (channelId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/channel/members/${channelId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();
    channelMembers.value = data.members || {};
  } catch {
    console.error("Error fetching channel members:");
  }
};

const openSelectedChannel = async (channelId) => {
  await channelInfo(channelId);
  await getChannelTextChannels(channelId);
  await fetchChannelMembers(channelId);
};

const handleUserStatusUpdate = (data) => {
  console.log("User status update received:", data);

  if (Object.keys(channelMembers?.value).length > 0) {
    const { userId, status } = data;

    for (const role in channelMembers.value) {
      const members = channelMembers.value[role];

      console.log(members);
      const memberIndex = members.findIndex((member) => member.id === userId);
      console.log("Member index:", memberIndex);
      if (memberIndex !== -1) {
        members[memberIndex].status = status;
        break;
      }
    }
  }
};

onMounted(() => {
  socket.on("user:status", handleUserStatusUpdate);
});

onBeforeUnmount(() => {
  console.log("Cleaning up socket listeners");
  socket.off("user:status", handleUserStatusUpdate);
});
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
  gap: 8px;

  padding: 4px;
  border-radius: 4px;

  cursor: pointer;
}

.text-channel:hover {
  background-color: #3c3c44;
}

.text-channel-info {
  display: flex;
  flex-direction: row;
  gap: 8px;

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

.members-list {
  display: flex;
  flex-direction: column;

  gap: 8px;

  margin-top: 16px;
  color: #c3c3bb;
}

.member-group {
  margin-bottom: 8px;
}

.member-role {
  text-transform: uppercase;
  font-weight: bold;
}

.member-title {
}

.member-item {
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 4px;
  border-radius: 4px;

  cursor: pointer;
}

.member-item:hover {
  background-color: #3c3c44;
}
</style>

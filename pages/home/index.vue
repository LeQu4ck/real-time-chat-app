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
          <MessageList
            :message-list="textChannelMessages"
            :selected-text-channel="selectedTextChannel"
          />

          <div class="text-input-area">
            <InputGroup>
              <InputText
                v-model="textMessageContent"
                placeholder="Text here"
                name="textMessageContent"
              />
              <InputGroupAddon>
                <PrimevueBtn
                  icon="pi pi-send"
                  severity="secondary"
                  @click="sendMessageAsync"
                />
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
const openSelectedTextChannel = async (textChannel) => {
  //console.log("Selected text channel ID:", textChannel);
  selectedTextChannel.value = textChannel;

  await fetchTextChannelMessages(selectedTextChannel?.value?._id);
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

const textMessageContent = ref(null);
const sendMessageAsync = async () => {
  if (!textMessageContent.value || textMessageContent.value.trim() === "") {
    emit(
      "show-toast",
      updateToastProps(
        "warn",
        "Error sending message",
        "Message content cannot be empty"
      )
    );

    return;
  }

  try {
    await $fetch("http://localhost:3000/api/channel/messages/create-message", {
      method: "POST",
      body: {
        channelTextId: selectedTextChannel.value._id,
        content: textMessageContent.value,
      },
      credentials: "include",
    });

    textMessageContent.value = "";
  } catch {
    emit(
      "show-toast",
      updateToastProps(
        "danger",
        "Couldn't send message",
        "An error occured while trying to send the message"
      )
    );
  }
};

const textChannelMessages = ref([]);
const hasMoreMessages = ref(true);
const isLoadingMessages = ref(false);
const lastTextChannelId = ref('0');
// const fetchTextChannelMessages = async (textChannelId) => {
//   try {
//     const response = await $fetch(
//       `http://localhost:3000/api/channel/messages/channel-messages/${textChannelId}`
//     );

//     textChannelMessages.value = (await response.messages) || [];
//   } catch {
//     return console.error("Error fetching text channel messages");
//   }
// };
const fetchTextChannelMessages = async (textChannelId) => {
  if (!textChannelId) return;

  const isNewChannel = textChannelId !== lastTextChannelId.value;

  if (isNewChannel) {
    textChannelMessages.value = [];
    hasMoreMessages.value = true;
    lastTextChannelId.value = textChannelId;
  }

  if (isLoadingMessages.value || !hasMoreMessages.value) return;

  const oldestTimestamp = isNewChannel
    ? undefined
    : textChannelMessages.value.at(-1)?.createdAt;

  isLoadingMessages.value = true;

  try {
    const response = await $fetch(
      `http://localhost:3000/api/channel/messages/channel-messages/${textChannelId}`,
      {
        query: oldestTimestamp ? { before: oldestTimestamp } : {},
      }
    );

    const newMessages = response?.messages || [];

    if (isNewChannel) {
      textChannelMessages.value = newMessages;
    } else {
      textChannelMessages.value = [
        ...newMessages,
        ...textChannelMessages.value,
      ];
    }

    hasMoreMessages.value = newMessages.length === 20;

    //console.log(textChannelMessages.value)
  } catch (err) {
    console.error("Error fetching messages:", err);
  } finally {
    isLoadingMessages.value = false;
  }
};

const openSelectedChannel = async (channelId) => {
  await channelInfo(channelId);
  await getChannelTextChannels(channelId);
  await fetchChannelMembers(channelId);
  await fetchTextChannelMessages(selectedTextChannel?.value?._id);
};

onMounted(() => {
  socket.on("user:status", handleUserStatusUpdate);

  watch(
    () => selectedTextChannel?.value?._id,
    (newChannelId, oldChannelId) => {
      if (newChannelId) {
        socket.emit("text-channel:leave", oldChannelId);
        socket.off("text-channel:message");
      }

      if (newChannelId) {
        socket.emit("text-channel:join", newChannelId);

        socket.on("text-channel:message", (message) => {
          //console.log("New message received:", message);
          if (message.channelTextId === selectedTextChannel.value?._id) {
            textChannelMessages.value.push(message);
            //console.log(textChannelMessages.value)
          }
        });
      }
    },
    { immediate: true }
  );
});

onBeforeUnmount(() => {
  console.log("Cleaning up socket listeners");
  socket.off("user:status", handleUserStatusUpdate);

  if (selectedTextChannel?.value?._id) {
    socket.emit("text-channel:leave", selectedTextChannel.value._id);
    socket.off("text-channel:message");
  }
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
  overflow: hidden;
}

.content {
  flex: 1 1 auto;
  display: flex;
  overflow: hidden;

  color: #fff;
}

.channel-info-area {
  flex: 0 0 15%;
  max-width: 15%;
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
  height: 100%;
  overflow: hidden;

  padding: 16px;
}

.text-input-area {
  background-color: #1e1b22;
}

.messages-area {
  display: flex;
  flex-direction: column;
  flex: 0 0 70%;
  max-width: 70%;

  border-top: #3c3c44 1px solid;
  border-right: #3c3c44 1px solid;

  position: relative;
}

.channel-members-area {
  flex: 0 0 15%;
  max-width: 15%;
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
  margin-bottom: 2px;
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

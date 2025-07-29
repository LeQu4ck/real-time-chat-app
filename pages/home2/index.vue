<template>
  <div class="wrapper flex flex-col">
    <ChannelList
      @show-toast="showToast"
      @selected-channel="openSelectedChannel"
    />

    <div
      v-if="currentChannel.name"
      class="flex flex-col w-full h-full overflow-hidden"
    >
      <div
        class="flex items-center justify-between border-t border-r border-b-0 border-l border-solid border-[#3c3c44] p-2 xl:hidden"
      >
        <PrimevueBtn
          icon="pi pi-objects-column"
          severity="help"
          rounded
          size="small"
          @click="toggleLeft"
        />

        <div class="flex flex-row items-center justify-center gap-2 w-full p-4">
          <i v-if="selectedTextChannel?.name" class="pi pi-receipt" />
          {{
            selectedTextChannel?.name
              ? selectedTextChannel?.name
              : "Select a text channel"
          }}
        </div>

        <PrimevueBtn
          icon="pi pi-users"
          severity="help"
          rounded
          size="small"
          @click="toggleRight"
        />
      </div>

      <div class="flex flex-1 overflow-hidden relative">
        <!-- first column -->
        <div
          :class="[
            'p-4 absolute left-0 xl:relative z-10 bg-[#302a38] h-full transition-transform duration-300 ease-in-out',
            showLeft
              ? 'translate-x-0 w-full sm:w-1/2 lg:w-1/3 ml-0'
              : '-translate-x-full',
            'xl:block xl:translate-x-0 xl:w-1/6 xl:bg-transparent',
            'border-t border-r-0 border-b-0 border-l border-solid rounded-r-xl xl:rounded-none border-[#3c3c44] overflow-y-auto',
          ]"
        >
          <div class="flex flex-col h-full">
            <div
              class="mb-4 border-t-0 border-r-0 border-b border-l-0 border-solid border-gray-300"
            >
              <ChannelModal :channel-data="currentChannel" />
            </div>

            <div class="text-[#c3c3bb]">
              <div class="flex justify-between mb-4">
                <p class="m-0 p-0 text-xl font-bold">Text channels</p>

                <PrimevueBtn
                  v-tooltip="'Create text channel'"
                  icon="pi pi-plus"
                  size="small"
                  variant="text"
                  rounded
                  severity="secondary"
                  aria-label="Create text channel"
                  @click="createTextChannel"
                />
              </div>

              <div class="flex flex-col gap-3">
                <div
                  v-for="txt in textChannels"
                  :key="txt?._id"
                  class="flex flex-row items-center gap-1 cursor-pointer rounded-sm hover:bg-[#3c3c44] px-2 py-1"
                  @click="openSelectedTextChannel(txt)"
                >
                  <i class="pi pi-receipt" />
                  {{ txt?.name }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- middle column -->
        <div
          :class="[
            'flex-1 h-full w-full overflow-y-auto transition-all duration-300',
            'xl:block',
            'border-t border-r border-b-0 border-l border-solid border-[#3c3c44]',
          ]"
        >
          <div class="h-full w-full flex flex-col">
            <div
              class="hidden xl:flex items-center justify-center gap-2 border-t-0 border-r-0 border-b border-l-0 border-solid border-[#3c3c44] w-full p-4"
            >
              <i v-if="selectedTextChannel?.name" class="pi pi-receipt" />
              {{
                selectedTextChannel?.name
                  ? selectedTextChannel?.name
                  : "Select a text channel"
              }}
            </div>

            <MessageList
              :message-list="textChannelMessages"
              :selected-text-channel="selectedTextChannel"
            />

            <div class="px-8 py-2">
              <InputGroup>
                <Textarea
                  v-model="textMessageContent"
                  placeholder="Text here"
                  name="textMessageContent"
                  rows="1"
                  style="resize: none; width: 100%"
                  @focus="attachEnterKeyListener"
                  @blur="detachEnterKeyListener"
                />
                <InputGroupAddon>
                  <PrimevueBtn
                    id="sendMessageButton"
                    icon="pi pi-send"
                    severity="secondary"
                    :loading="sendingMessageLoading"
                    @click="sendMessageAsync"
                  />
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        </div>

        <!-- third column -->
        <div
          :class="[
            'p-4 absolute right-0 xl:relative z-10 bg-[#302a38] h-full transition-transform duration-300 ease-in-out',
            showRight
              ? 'translate-x-0 w-full sm:w-1/2 lg:w-1/3 mr-0'
              : 'translate-x-full',
            'xl:block xl:translate-x-0 xl:w-1/6 xl:bg-transparent',
            'border-t border-r-0 border-b-0 border-l border-solid rounded-l-xl xl:rounded-none border-[#3c3c44] overflow-y-auto break-words',
          ]"
        >
          <div class="flex flex-col h-full">
            <div
              class="mb-4 border-t-0 border-r-0 border-b border-l-0 border-solid border-gray-300 pb-2 text-md"
            >
              <p class="text-md">Members</p>
            </div>
            <div class="flex flex-col text-[#c3c3bb]">
              <div
                v-for="(members, role) in channelMembers"
                :key="role"
                class="flex flex-col gap-4"
              >
                <p class="m-0 p-0 text-xl font-bold">
                  {{ role.toUpperCase() }}
                </p>

                <div
                  v-for="member in members"
                  :key="member._id"
                  class="flex flex-col gap-8"
                >
                  <div class="flex flex-col gap-2">
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
      </div>
    </div>
    <CreateTextChannelModal
      :open="isTextChannelModalOpen"
      :channel-id="currentChannel._id"
      @close-create-text-channel-modal="closeCreateTextChannelModal"
      @refresh-channel-list="refreshTextChannelList"
      @show-toast="showToast"
    />
  </div>
</template>

<script setup>
import { Textarea } from "#components";
import PrimevueBtn from "primevue/button";
//import ButtonGroup from "primevue/buttongroup";
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
    const response = await $fetch(`/api/channel/${channelId}`, {
      method: "GET",
      credentials: "include",
    });

    currentChannel.value = response.channel || {};

    //console.log("Current channel:", currentChannel.value);
  } catch {
    console.error("Error fetching channel info");
  }
};
const textChannels = ref();
const getChannelTextChannels = async (channelId) => {
  try {
    const response = await $fetch(`/api/text-channels/${channelId}`, {
      method: "GET",
      credentials: "include",
    });

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
    const response = await fetch(`/api/channel/members/${channelId}`, {
      method: "GET",
      credentials: "include",
    });

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

      //console.log(members);
      const memberIndex = members.findIndex((member) => member._id === userId);
      //console.log("Member index:", memberIndex);
      if (memberIndex !== -1) {
        members[memberIndex].status = status;
        break;
      }
    }
  }
};

const textMessageContent = ref(null);
const sendingMessageLoading = ref(false);
const sendMessageAsync = async () => {
  const trimmedMessage = textMessageContent.value?.trim();

  if (!trimmedMessage || trimmedMessage === "") {
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

  textMessageContent.value = "";

  try {
    sendingMessageLoading.value = true;

    await $fetch("/api/channel/messages/create-message", {
      method: "POST",
      body: {
        channelId: currentChannel.value._id,
        channelTextId: selectedTextChannel.value._id,
        content: trimmedMessage,
      },
      credentials: "include",
    });
  } catch {
    emit(
      "show-toast",
      updateToastProps(
        "danger",
        "Couldn't send message",
        "An error occured while trying to send the message"
      )
    );
  } finally {
    sendingMessageLoading.value = false;
  }
};

const textChannelMessages = ref([]);
const hasMoreMessages = ref(true);
const isLoadingMessages = ref(false);
const lastTextChannelId = ref("0");
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
      `/api/channel/messages/channel-messages/${textChannelId}`,
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

// onMounted(() => {
//   const messageButton = document.getElementById("")
// })

const attachEnterKeyListener = async () => {
  window.addEventListener("keydown", handleKeyPress);
};

const detachEnterKeyListener = () => {
  window.removeEventListener("keydown", handleKeyPress);
};

const handleKeyPress = async (event) => {
  if (event.keyCode === 13 && event.key === "Enter" && !event.shiftKey) {
    await sendMessageAsync();
  }
};

watchEffect(() => currentChannel);

// const showLeft = ref(false);
// const showRight = ref(false);

const showLeft = ref(false);
const showRight = ref(false);

const toggleLeft = () => {
  showLeft.value = !showLeft.value;
  if (showLeft.value) showRight.value = false;
};

const toggleRight = () => {
  showRight.value = !showRight.value;
  if (showRight.value) showLeft.value = false;
};

const isTextChannelModalOpen = ref(false);
const createTextChannel = () => {
  isTextChannelModalOpen.value = true;
};

const closeCreateTextChannelModal = () => {
  isTextChannelModalOpen.value = false;
};

const refreshTextChannelList = async () => {
  await getChannelTextChannels(currentChannel?.value._id);
};

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
  /* align-items: center;
  justify-content: center; */
  width: 100%;
  height: calc(100vh - 72px);
  background: linear-gradient(145deg, #2a2430, #201c24);
  margin-top: 4px;
  overflow: hidden;
}
</style>

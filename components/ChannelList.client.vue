<template>
  <div>
    <div class="channels-list">
      <PrimevueBtn
        icon="pi pi-plus"
        class="add-channel-button"
        severity="success"
        @click="addChannelModal = true"
      />
      <div
        v-for="channel in channelList"
        :key="channel.channelId"
        class="channel-bubble"
        @click="openChannelEmit(channel.channelId)"
      >
        <i class="pi pi-megaphone" />
        <span>{{ channel.channelName }}</span>
      </div>
    </div>

    <Dialog v-model:visible="addChannelModal" header="Welcome" modal>
      <div class="p-4">
        <h2>Add a new channel</h2>
        <p>Here you can add a new channel to your list.</p>

        <div class="new-channel-form">
          <InputText
            v-model="newChannelName"
            placeholder="Enter channel name"
            class="w-full mb-4"
          />

          <InputText
            v-model="newChannelDescription"
            placeholder="Enter channel description"
            class="w-full mb-4"
          />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer-buttons">
          <PrimevueBtn
            label="Add"
            icon="pi pi-check"
            class="p-button-success"
            :loading="saveChannelLoading"
            @click="saveChannel"
          />
          <PrimevueBtn
            label="Close"
            icon="pi pi-times"
            severity="danger"
            @click="addChannelModal = false"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import PrimevueBtn from "primevue/button";
import { updateToastProps } from "~/utils/utils";

const emit = defineEmits(["show-toast", "selected-channel"]);

const saveChannelLoading = ref(false);

const channelList = ref([]);

const fetchChannels = async () => {
  try {
    const response = await $fetch(
      "http://localhost:3000/api/channel/channel-user",
      {
        method: "GET",
        credentials: "include",
      }
    );

    channelList.value = response.channels || [];
  } catch (error) {
    console.error("Error fetching channels:", error);
  }
};

const addChannelModal = ref(false);

const newChannelName = ref("");
const newChannelDescription = ref("");

const saveChannel = async () => {
  if (!newChannelName.value) {
    alert("Please fill in the name.");
    return;
  }

  try {
    saveChannelLoading.value = true;

    const newChannel = {
      name: newChannelName.value,
      description: newChannelDescription.value,
    };

    console.log(newChannel)

    await $fetch("http://localhost:3000/api/channel/channel-create", {
      method: "POST",
      body: newChannel,
      credentials: "include",
    });

    await fetchChannels();

    emit(
      "show-toast",
      updateToastProps(
        "success",
        "Channel Created",
        "Channel has been created successfully."
      )
    );
  } catch (error) {
    console.error("Error saving channel:", error);
  } finally {
    saveChannelLoading.value = false;
    newChannelName.value = "";
    newChannelDescription.value = "";
    addChannelModal.value = false;
  }
};

const openChannelEmit = (value) => {
  emit("selected-channel", value);
};

onMounted(async () => {
  await fetchChannels();
});

onMounted(() => {
  const container = document.querySelector(".channels-list");
  container?.addEventListener("wheel", (e) => {
    if (e.deltaY === 0) return;
    e.preventDefault();
    container.scrollLeft += e.deltaY;
  });
});
</script>

<style scoped>
.channels-list {
  display: flex;
  flex-direction: row;
  align-items: center;

  gap: 24px;

  padding: 16px 16px;

  overflow-x: hidden;
  overflow-y: hidden;
}

.channels-list > .add-channel-button {
  cursor: pointer;
  /* color: var(--surface-ground); */

  width: 48px;
  height: 48px;
  border-radius: 50%;

  border: 1px solid transparent;

  transition: all 0.2s ease-in-out;

  flex-shrink: 0;
}

.channels-list > .add-channel-button:hover {
  background-color: var(--success-color-hover);
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  border-color: #c3c3bb;
}

.channel-bubble {
  display: flex;

  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  padding: 8px 12px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #2d272f;
  gap: 8px;

  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  border: 1px solid transparent;

  transition: all 0.2s ease-in-out;

  cursor: pointer;
}

.channel-bubble:hover {
  background-color: #3c3535;
  transform: scale(1.06);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);

  border-color: #c3c3bb;
}

.dialog-footer-buttons {
  display: flex;
  justify-content: flex- row;
  gap: 8px;
}

.new-channel-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
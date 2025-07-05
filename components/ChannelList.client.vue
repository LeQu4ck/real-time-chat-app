<template>
  <div>
    <div class="channels-list">
      <PrimevueBtn
        icon="pi pi-plus"
        class="add-channel-button"
        severity="success"
        @click="addOrCreateChannelModal = true"
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

    <Dialog v-model:visible="addOrCreateChannelModal" header="Welcome" modal>
      <div>
        <ChannelAddOrCreate
          ref="dialogChannelFormRef"
          @dialog-save="onDialogSave"
        />
      </div>
      <template #footer>
        <div class="dialog-footer-buttons">
          <PrimevueBtn
            label="Save"
            icon="pi pi-check"
            class="p-button-success"
            :loading="saveButtonLoadingState"
            @click="handleAddOrCreateDialog"
          />
          <PrimevueBtn
            label="Close"
            icon="pi pi-times"
            severity="danger"
            @click="addOrCreateChannelModal = false"
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

const addOrCreateChannelModal = ref(false);
const dialogChannelFormRef = ref(null);
const saveButtonLoadingState = ref(false);

const onDialogSave = async (data) => {
  if (data?.type === "add") {
    //console.log(data);
    await addChannel(data.channelCode);
  }

  if (data?.type === "create") {
    //console.log(data);
    await saveChannel(data?.channelName, data?.channelDescription);
  }
};

const saveChannel = async (name, description) => {
  if (!name) {
    emit(
      "show-toast",
      updateToastProps(
        "warn",
        "Missing name",
        "Please add channel name before saving."
      )
    );
    return;
  }

  try {
    saveButtonLoadingState.value = true;

    const newChannel = {
      name,
      description,
    };

    console.log(newChannel);

    const response = await $fetch(
      "http://localhost:3000/api/channel/channel-create",
      {
        method: "POST",
        body: newChannel,
        credentials: "include",
      }
    );

    if (response?.statusCode === 201) {
      await fetchChannels();

      emit(
        "show-toast",
        updateToastProps(
          "success",
          "Channel Created",
          "Channel has been created successfully."
        )
      );
    }
  } catch (error) {
    console.error("Error saving channel:", error);
  } finally {
    saveButtonLoadingState.value = false;
    // newChannelName.value = "";
    // newChannelDescription.value = "";
    addOrCreateChannelModal.value = false;
  }
};

const addChannel = async (channelCode) => {
  if (!channelCode) {
    emit(
      "show-toast",
      updateToastProps(
        "warn",
        "Missing channel code",
        "Please add channel code before saving."
      )
    );
  }

  try {
    saveButtonLoadingState.value = true;

    const response = await $fetch(
      "http://localhost:3000/api/channel/join/channel-join-with-code",
      {
        method: "POST",
        body: { channelCode: channelCode },
        credentials: "include",
      }
    );

    if (response.statusCode === 201) {
      await fetchChannels();

      emit(
        "show-toast",
        updateToastProps(
          "success",
          "Channel added",
          "You've been added to the requested channel"
        )
      );
    }
  } catch {
    emit(
      "show-toast",
      updateToastProps("error", "Error", "Failed to add channel")
    );
  } finally {
    saveButtonLoadingState.value = false;
    addOrCreateChannelModal.value = false;
  }
};

const handleAddOrCreateDialog = () => {
  dialogChannelFormRef.value?.handleSave();
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
</style>

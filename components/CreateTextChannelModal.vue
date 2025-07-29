<template>
  <Dialog
    v-model:visible="createTextChannelModal"
    header="Create a new channel"
    modal
  >
    <div class="mb-4">
      <FloatLabel variant="in">
        <label for="newTextChannelNameLabel">Text channel name</label>
        <InputText
          id="newTextChannelNameLabel"
          v-model="newTextChannelName"
          autocomplete="off"
          class="w-full"
        />
      </FloatLabel>
    </div>

    <template #footer>
      <PrimvevueBtn
        label="Save"
        icon="pi pi-check"
        :loading="saveButtonLoadingState"
        @click="saveModal"
      />
      <PrimvevueBtn
        label="Close"
        icon="pi pi-times"
        severity="danger"
        @click="closeModal"
      />
    </template>
  </Dialog>
</template>
<script setup>
import PrimvevueBtn from "primevue/button";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  channelId: {
    type: String,
    default: ""
  },
});

const emit = defineEmits(["close-create-text-channel-modal", "show-toast", "refresh-channel-list"]);

const createTextChannelModal = ref(false);
const newTextChannelName = ref("");
const channelIdRef = ref("");
const saveButtonLoadingState = ref(false);

const saveModal = async () => {
  const channelName = newTextChannelName.value.trim();

  if (!channelName || channelName === "") {
    emit(
      "show-toast",
      updateToastProps(
        "warn",
        "Text channel name required",
        "Please provide a text channel name."
      )
    );
  }

  //might need clearing here

  try {
    saveButtonLoadingState.value = true;

    await $fetch("/api/text-channels/create-text-channel", {
      method: "POST",
      body: {
        channelId: channelIdRef.value,
        content: channelName,
      },
    });

    emit(
      "show-toast",
      updateToastProps(
        "success",
        "Text channel created",
        "Text channel created successfully."
      )
    );

    newTextChannelName.value = "";
    emit("refresh-channel-list")
  } catch (error) {
    emit(
      "show-toast",
      updateToastProps(
        "error",
        "Error",
        error?.data?.message || "Internal server error."
      )
    );
  } finally {
    saveButtonLoadingState.value = false;
  }
};

const closeModal = () => {
  createTextChannelModal.value = false;
  newTextChannelName.value = "";
  emit("close-create-text-channel-modal");
};

watchEffect(() => {
  createTextChannelModal.value = props.open;
});

watchEffect(() => {
  channelIdRef.value = props.channelId;
});

watchEffect(() => {
  if (createTextChannelModal.value === false) {
    emit("close-create-text-channel-modal");
  }
});
</script>

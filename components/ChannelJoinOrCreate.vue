<template>
  <div style="min-width: 32vw">
    <Tabs v-model:value="currentTab">
      <TabList>
        <Tab value="0">Join channel</Tab>
        <Tab value="1">Create channel</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <div class="p-4">
            <h2>Join a new channel</h2>
            <!-- <p>Here you can add a new channel to your list.</p> -->

            <div class="channel-form">
              <InputText
                v-model="joinChannelCode"
                placeholder="Enter channel code"
                class="w-full mb-4"
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel value="1">
          <div class="p-4">
            <h2>Create a new channel</h2>
            <!-- <p>Here you can create a new channel.</p> -->

            <div class="channel-form">
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
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup>
const emit = defineEmits(["dialog-save"]);

const currentTab = ref("0");

const joinChannelCode = ref("");

const newChannelName = ref("");
const newChannelDescription = ref("");

const handleSave = () => {
  if (currentTab.value === "0") {
    emit("dialog-save", {
      type: "add",
      channelCode: joinChannelCode.value,
    });
  }

  if (currentTab.value === "1") {
    emit("dialog-save", {
      type: "create",
      channelName: newChannelName.value,
      channelDescription: newChannelDescription.value,
    });
  }
};

defineExpose({
  handleSave,
});
</script>

<style scoped>
.channel-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>

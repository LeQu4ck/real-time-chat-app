<template>
  <div>
    <section class="welcome-container">
      <div class="welcome-content">
        <h1 class="headline">Welcome to SocketChat</h1>
        <p class="subtitle">
          Join real-time conversations in themed channels. Fast, simple,
          anonymous.
        </p>
      </div>
    </section>

    <!-- <div>
      <Connection />
    </div> -->

    <!-- <Dialog v-model:visible="addChannelModal" header="Welcome" modal>
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
          <Button
            label="Add"
            icon="pi pi-check"
            class="p-button-success"
            @click="saveChannel"
          />
          <Button
            label="Close"
            icon="pi pi-times"
            severity="danger"
            @click="addChannelModal = false"
          />
        </div>
      </template>
    </Dialog> -->
  </div>
</template>

<script setup>
//import { PrimeIcons } from "@primevue/core/api";
//import { io } from "socket.io-client";
//import Dialog from "primevue/dialog";

// const addChannelModal = ref(false);

// const newChannelName = ref("");
// const newChannelDescription = ref("");

//  const saveChannel = async () => {
//   if (!newChannelName.value) {
//     alert("Please fill in the name.");
//     return;
//   }

//   try {
//     const newChannel = {
//       name: newChannelName.value,
//       description: newChannelDescription.value,
//     };

//     await $fetch("http://localhost:3000/api/channel/channel-create", {
//       method: "POST",
//       body: newChannel,
//     });

//     newChannelName.value = "";
//     newChannelDescription.value = "";

//     addChannelModal.value = false;
//   } catch (error) {
//     console.error("Error saving channel:", error);
//   }
// };
</script>

<style scoped>
/* .channels {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;

  overflow-x: scroll;
  overflow-y: hidden;

  padding: 10px 0px;
  gap: 24px;
} */

/* .dialog-footer-buttons {
  display: flex;
  justify-content: flex- row;
  gap: 8px;
} */

/* .new-channel-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
} */

/* .auth-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
} */

.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px); /* Ajustează după înălțimea meniului */
  background: linear-gradient(145deg, #2a2430, #201c24);
  color: #fff;
  padding: 2rem;
}

.welcome-content {
  text-align: center;
  max-width: 600px;
}

.headline {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.25rem;
  opacity: 0.85;
}
</style>

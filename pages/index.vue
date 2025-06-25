<template>
  <div>
    <section class="welcome-container">
      <div class="welcome-content">
        <h1 class="headline">Welcome to SocketChat</h1>
        <p class="subtitle">Join real-time conversations in themed channels.</p>
      </div>
    </section>

    <!-- <div>
      <Connection />
    </div> -->
  </div>
</template>

<script setup>
//import { PrimeIcons } from "@primevue/core/api";
//import { io } from "socket.io-client";
//import Dialog from "primevue/dialog";
</script>

<style scoped>
/* .auth-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
} */

.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 72px);
  background: linear-gradient(
    145deg,
    var(--surface-ground),
    var(--surface-section)
  );
  color: var(--text-color);
  padding: 2rem;
  margin-top: 4px;
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

<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <p>Status: {{ isConnected ? "connected" : "disconnected" }}</p>
    <p>Transport: {{ transport }}</p>
  </div>
</template>

<script setup>
import { socket } from "./sockets";

const isConnected = ref(false);
const transport = ref("N/A");

if (socket.connected) {
  onConnect();
}

const onConnect = () => {
  isConnected.value = true;
  transport.value = socket.io.engine.transport.name;

  socket.io.engine.on("upgrade", (rawTransport) => {
    transport.value = rawTransport.name;
  });
};

const onDisconnect = () => {
  isConnected.value = false;
  transport.value = "N/A";
};

socket.on("connect", onConnect);
socket.on("disconnect", onDisconnect);

onBeforeUnmount(() => {
  socket.off("connect", onConnect);
  socket.off("disconnect", onDisconnect);
});
</script>

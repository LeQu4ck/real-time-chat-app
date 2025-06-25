<template>
  <div>
    <Toast />
    <NavigationClient />
    <NuxtPage @show-toast="showToast" />
  </div>
</template>

<script setup>
import "primeicons/primeicons.css";
import "public/theme-colors.css";
import NavigationClient from "./components/Navigation.client.vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useAuth } from "~/composables/useAuth";
import { socket } from "./components/sockets";

const { fetchUser, user } = useAuth();
const toast = useToast();

const showToast = (toastProps) => {
  console.log("showToast called with props:", toastProps);
  toast.add({
    severity: toastProps.severity || "info",
    summary: toastProps.summary || "Notification",
    detail: toastProps.detail || "Might or might not.",
    life: 5000,
  });
};

onMounted(async () => {
  await fetchUser();

  if (user?.value?.email) {
    socket.on("connection", () => {
      console.log("Socket connected:", socket.id);
    });
  }
});
</script>
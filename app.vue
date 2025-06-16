<template>
  <div>
    <NavigationClient />
    <NuxtPage />
  </div>
</template>

<script setup>
import "primeicons/primeicons.css";
import NavigationClient from "./components/Navigation.client.vue";
import { useAuth } from "~/composables/useAuth";

//const { fetchUser } = useAuth()


onMounted(() => {
  useAuth().fetchUser();
});
</script>

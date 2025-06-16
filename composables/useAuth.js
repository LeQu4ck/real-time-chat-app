import { ref } from "vue";

const user = ref(null);

const useAuth = () => {
  const fetchUser = async () => {
    try {
      const response = await $fetch("/api/auth/me", {
        credentials: "include",
      });

      user.value = response.user;
    } catch {
      user.value = null;
    }
  };

  const logOut = async () => {
    await $fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    user.value = null;
    navigateTo("/");
  };

  return { fetchUser, logOut };
};

export { user, useAuth }; 

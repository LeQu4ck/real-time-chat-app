import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async () => {
  const { user } = useAuth();

  // if (!user.value) {
  //   await fetchUser()
  // }
  //console.log(user);
  if (!user.value) {
    return navigateTo("/");
  }
});

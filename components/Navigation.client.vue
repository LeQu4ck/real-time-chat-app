<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <Menubar :model="menuItems" />

    <Dialog v-model:visible="logInDialog" header="Log in" modal>
      <template #header>
        <div class="p-4">
          <h2>Log in</h2>
          <p>Log in to your account to access more features.</p>
        </div>
      </template>

      <div class="auth-form">
        <InputText
          v-model="email"
          placeholder="Enter your email"
          class="w-full mb-4"
        />

        <InputText
          v-model="password"
          type="password"
          placeholder="Enter your password"
          class="w-full mb-4"
        />
      </div>

      <template #footer>
        <div class="dialog-footer-buttons">
          <PrimevueBtn
            label="Log in"
            icon="pi pi-sign-in"
            severity="success"
            :loading="logInBtnLoading"
            @click="logInAsync"
          />
          <PrimevueBtn
            label="Close"
            icon="pi pi-times"
            severity="danger"
            @click="logInDialog = false"
          />
        </div>
      </template>
    </Dialog>

    <Dialog v-model:visible="signUpDialog" header="Sign up" modal>
      <template #header>
        <div class="p-4">
          <h2>Sign up</h2>
          <p>Creat a new account to access more features.</p>
        </div>
      </template>

      <div class="auth-form">
        <InputText
          v-model="email"
          placeholder="Enter your email"
          class="w-full mb-4"
        />

        <InputText
          v-model="password"
          type="password"
          placeholder="Enter your password"
          class="w-full mb-4"
        />
      </div>

      <template #footer>
        <div class="dialog-footer-buttons">
          <PrimevueBtn
            label="Sign up"
            icon="pi pi-user-plus"
            class="p-button-success"
            :loading="signUpBtnLoading"
            @click="signUpAsync"
          />
          <PrimevueBtn
            label="Close"
            icon="pi pi-times"
            severity="danger"
            @click="signUpDialog = false"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import Dialog from "primevue/dialog";
import PrimevueBtn from "primevue/button";
import { ref } from "vue";
import { useAuth } from "~/composables/useAuth";
import { socket } from "~/components/sockets";
import { updateToastProps } from "~/utils/utils.js";

const { user, fetchUser, logOut } = useAuth();

const menuItems = ref([]);

const emit = defineEmits(["show-toast"]);

const buildMenu = () => {
  menuItems.value = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => {
        navigateTo("/home2");
      },
    },
    ...(user.value
      ? [
          {
            label: `Hello, ${user.value.email}`,
            icon: "pi pi-user",
            items: [
              {
                label: "Profile",
                icon: "pi pi-id-card",
                command: () => {
                  navigateTo("/profile");
                },
              },
              {
                label: "Settings",
                icon: "pi pi-cog",
                command: () => {
                  navigateTo("/settings");
                },
              },
              {
                label: "Log out",
                icon: "pi pi-sign-out",
                command: async () => {
                  await logOutAsync();
                },
              },
            ],
          },
        ]
      : [
          {
            label: "Log in",
            icon: "pi pi-sign-in",
            command: () => {
              logInDialog.value = true;
            },
          },
          {
            label: "Sign up",
            icon: "pi pi-user-plus",
            command: () => {
              signUpDialog.value = true;
            },
          },
        ]),
  ];
};

const logInDialog = ref(false);
const logInBtnLoading = ref(false);

const signUpDialog = ref(false);
const signUpBtnLoading = ref(false);

const email = ref("");
const password = ref("");

const signUpAsync = async () => {
  if (!email.value || !password.value) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    signUpBtnLoading.value = true;

    const payload = {
      email: email.value,
      password: password.value,
    };

    const response = await $fetch("/api/auth/register", {
      method: "POST",
      body: payload,
    });

    email.value = "";
    password.value = "";

    signUpDialog.value = false;

    if (response.success) {
      emit(
        "show-toast",
        updateToastProps(
          "success",
          "Account created",
          "Your accound has been created."
        )
      );
    }
  } catch (error) {
    console.error("Error signing up:", error.message);

    if (error?.statusCode === 409) {
      emit(
        "show-toast",
        updateToastProps(
          "error",
          "Error creating account",
          "This user already exists."
        )
      );
    } else {
      emit(
        "show-toast",
        updateToastProps("error", "Error", "An error has occured")
      );
    }
  } finally {
    signUpBtnLoading.value = false;
  }
};

const logInAsync = async () => {
  if (!email.value || !password.value) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    logInBtnLoading.value = true;

    const payload = {
      email: email.value,
      password: password.value,
    };

    const result = await $fetch("/api/auth/login", {
      method: "POST",
      body: payload,
      credentials: "include",
    });

    email.value = "";
    password.value = "";

    logInDialog.value = false;

    if (result && result.user) {
      await fetchUser();
      socket.emit("user:login");

      buildMenu();
      await navigateTo("/home");
    } else {
      console.error("Login failed, no user returned.");
    }
  } catch {
    emit(
      "show-toast",
      updateToastProps(
        "error",
        "Error",
        "Login failed. Check your credentials."
      )
    );
  } finally {
    logInBtnLoading.value = false;
  }
};

const logOutAsync = async () => {
  try {
    socket.emit("user:logout");

    await logOut();

    buildMenu();
    await navigateTo("/");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

onMounted(() => {
  buildMenu();
});

watch(user, buildMenu);
</script>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dialog-footer-buttons {
  display: flex;
  justify-content: flex- row;
  gap: 8px;
}

.dialog-footer-buttons > .p-button-success {
  color: var(--surface-ground);
}
.dialog-footer-buttons > .p-button-danger {
  color: var(--surface-ground);
}
</style>

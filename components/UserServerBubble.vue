<template>
  <div class="flex flex-row items-center gap-2">
    <div>
      <div
        class="relative flex justify-center items-center rounded-full px-2 py-2 w-[40px] h-[40px] bg-[#fff] text-sm font-bold text-center"
        :style="{ backgroundColor: bgColor, color: textColor }"
      >
        {{ props.userData?.email?.slice(0, 2).toUpperCase() }}
        <Badge
          v-if="props?.userData?.status"
          :severity="
            props?.userData?.status === 'online' ? 'success' : 'danger'
          "
          class="absolute bottom-0 right-0 w-3 h-3 border-white"
        />
      </div>
    </div>

    <div class="text-lg" :style="{ color: bgColor }">
      {{ props.userData?.email }}
    </div>
  </div>
</template>
<script setup>
import { getUserColor, getContrastColor } from "~/utils/user-color";

const props = defineProps({
  userData: {
    type: Object,
    default: () => ({}),
  },
});

const bgColor = ref("");
const textColor = ref("");

onMounted(() => {
  bgColor.value = getUserColor(props?.userData?.email || "default");
  textColor.value = getContrastColor(bgColor.value);
});
</script>

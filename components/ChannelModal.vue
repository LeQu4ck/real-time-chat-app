<template>
  <div>
    <PanelMenu :model="optionsList" class="pb-2 text-md">
      <template #item="{ item }">
        <a
          v-ripple
          class="flex justify-start items-center cursor-pointer group"
        >
          <span :class="[item.icon, 'text-primary group-hover:text-inherit']" />
          <p :class="['ml-2', { 'font-semibold': item.items }]">{{
            item.label
          }}</p>
        </a>
      </template>
    </PanelMenu>
  </div>
</template>
<script setup>
import { PanelMenu } from "#components";

const emit = defineEmits(["show-toast"]);

const props = defineProps({
  channelData: {
    type: Object,
    required: true,
  },
});

const optionsList = ref([]);

watch(
  () => props?.channelData,
  (newCh) => {
    optionsList.value = [
      {
        label: newCh.name,
        icon: "pi pi-angle-down",
        items: [
          {
            label: newCh?.uniqueJoinCode,
            icon: "pi pi-user-plus",
            command: () => {
              navigator.clipboard.writeText(newCh?.uniqueJoinCode);
              emit(
                "show-toast",
                updateToastProps(
                  "success",
                  "Channel code copied",
                  "The channel join code has been copied to your clipboard."
                )
              );
            },
          },
          {
            label: "Settings",
            icon: "pi pi-cog",
          },
        ],
      },
    ];
  },
  { immediate: true }
);
</script>
<style>
/* .p-panelmenu {
  background-color: transparent !important;
  min-width: min-content;
} */

.p-panelmenu-panel {
  background-color: transparent !important;
  border: none !important;
  padding: 0;
}

.p-panelmenu-item-content:hover {
  background-color: var(--hover-color) !important;
}

/* .p-panelmenu-header-link {
  padding: 0;
} */
</style>

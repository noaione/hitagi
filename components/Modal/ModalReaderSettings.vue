<template>
  <ModalContainer
    v-model:show="modalOpen"
    class="flex h-[80vh] w-screen flex-col !bg-gray-100 dark:!bg-gray-900 md:w-[80vw] lg:w-[60vw]"
    @close="$emit('update:open', false)"
  >
    <template #header>
      <div class="block text-lg font-bold">Reader Settings</div>
    </template>
    <template #footer>
      <div class="flex flex-col">
        <span class="mb-4 text-center text-sm italic text-hitagi-400">Changes is autosaved on the local storage.</span>
        <HitagiButton @click="$emit('update:open', false)">Close</HitagiButton>
      </div>
    </template>

    <div class="flex w-full flex-col gap-4">
      <HitagiRadioContainer class="w-full flex-wrap gap-2">
        <template #label>
          <span class="mb-2 font-semibold">Reading Direction</span>
        </template>
        <HitagiRadioBlock
          v-for="[flowKey, flowVal] in Object.entries(FlowTextInfo)"
          :key="flowKey"
          v-model="settings.flow"
          class="rounded"
          :value="flowKey"
          filled
        >
          <div class="block px-2 py-2">
            {{ flowVal }}
          </div>
        </HitagiRadioBlock>
      </HitagiRadioContainer>
      <HitagiRadioContainer class="w-full flex-wrap gap-2">
        <template #label>
          <span class="mb-2 font-semibold">Paging Mode</span>
        </template>
        <HitagiRadioBlock v-model="settings.pagingMode" class="rounded" value="single" filled>
          <div class="block px-2 py-2">Single</div>
        </HitagiRadioBlock>
        <HitagiRadioBlock v-model="settings.pagingMode" class="rounded" value="double" filled>
          <div class="block px-2 py-2">Double</div>
        </HitagiRadioBlock>
        <HitagiRadioBlock v-model="settings.pagingMode" class="rounded" value="double-cover" filled>
          <div class="block px-2 py-2">Double (cover)</div>
        </HitagiRadioBlock>
      </HitagiRadioContainer>
      <HitagiRadioContainer class="w-full flex-wrap gap-2">
        <template #label>
          <span class="mb-2 font-semibold">Background Color</span>
        </template>
        <HitagiRadioBlock v-model="settings.background" class="rounded" value="gray" filled>
          <div class="block px-2 py-2">Gray-ish</div>
        </HitagiRadioBlock>
        <HitagiRadioBlock v-model="settings.background" class="rounded" value="black" filled>
          <div class="block px-2 py-2">Black</div>
        </HitagiRadioBlock>
        <HitagiRadioBlock v-model="settings.background" class="rounded" value="white" filled>
          <div class="block px-2 py-2">White</div>
        </HitagiRadioBlock>
      </HitagiRadioContainer>
      <HitagiRadioContainer class="w-full flex-wrap gap-2">
        <template #label>
          <span class="mb-2 font-semibold">Fit mode</span>
        </template>
        <HitagiRadioBlock v-model="settings.fitMode" class="rounded" value="screen-height" filled>
          <div class="block px-2 py-2">Screen Height</div>
        </HitagiRadioBlock>
        <HitagiRadioBlock v-model="settings.fitMode" class="rounded" value="screen-width" filled>
          <div class="block px-2 py-2">Screen Width</div>
        </HitagiRadioBlock>
      </HitagiRadioContainer>
    </div>
  </ModalContainer>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const settings = useLRRReaderConfig();

const modalOpen = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

// Text data
const FlowTextInfo = {
  ltr: "Left-to-Right",
  rtl: "Right-to-Left",
  vertical: "Vertical",
};
</script>

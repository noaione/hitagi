<template>
  <ModalContainer
    v-model:show="modalOpen"
    class="flex h-[80vh] w-screen flex-col overflow-y-scroll !bg-gray-100 dark:!bg-gray-900 md:w-[80vw] lg:w-[60vw]"
    @close="$emit('update:open', false)"
  >
    <template #header>
      <div class="block text-lg font-bold">Navigate Page</div>
    </template>
    <template #footer>
      <div class="flex flex-col">
        <HitagiButton @click="$emit('update:open', false)">Close</HitagiButton>
      </div>
    </template>

    <HitagiRadioContainer
      class="mx-auto max-h-[60vh] w-full basis-full flex-row flex-wrap justify-start gap-4 overflow-x-hidden overflow-y-scroll"
    >
      <HitagiRadioBlock
        v-for="(imgPair, idx) in reader.pairedImages"
        :key="`page-nav-pair-${idx}`"
        v-model="pageNumber"
        :value="idx"
        filled
      >
        <div class="block h-10 w-10 p-2 text-center">
          {{ renderPair(imgPair) }}
        </div>
      </HitagiRadioBlock>
    </HitagiRadioContainer>
  </ModalContainer>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean;
  pair: number;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "update:pair", value: number): void;
}>();

const reader = useLRRReader();

const modalOpen = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

const pageNumber = computed({
  get: () => props.pair,
  set: (pairValue) => {
    emit("update:pair", pairValue);
    emit("update:open", false);
  },
});

function renderPair(loadedPages: LoadedImage[]): string {
  return loadedPages.map((page) => page.page.toString()).join("-");
}
</script>

<template>
  <div
    ref="readerContainerRef"
    :class="`block ${readerConf.fitMode === 'screen-height' ? 'min-h-screen w-auto' : 'h-auto min-w-[100vw]'}`"
  >
    <ReaderPaged v-if="readerDirection === 'paged'" />
    <ReaderVertical v-else-if="readerDirection === 'vertical'" />
  </div>
  <ReaderScreenSpy :reference="readerContainerRef" />
</template>

<script setup lang="ts">
const reader = useLRRReader();
const readerConf = useLRRReaderConfig();
const readerContainerRef = ref<HTMLDivElement>();

// We're using this to ensure when stuff changes, we're ready.
const readerDirection = ref<"vertical" | "paged" | undefined>(undefined);

watch(
  () => reader.currentPage,
  () => reader.preloadImagesFromConfig()
);

watch(
  () => readerConf.flow,
  async (newFlow) => {
    const isPaged = ["ltr", "rtl"].includes(newFlow);

    readerDirection.value = isPaged ? "paged" : "vertical";
  },
  {
    immediate: true,
  }
);
</script>

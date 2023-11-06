<template>
  <div
    ref="readerContainerRef"
    :class="`block ${readerConf.fitMode === 'screen-height' ? 'min-h-screen w-auto' : 'h-auto min-w-[100vw]'}`"
  >
    <ReaderPaged v-if="readerConf.isPaged" />
  </div>
  <ReaderScreenSpy :reference="readerContainerRef" />
</template>

<script setup lang="ts">
const reader = useLRRReader();
const readerConf = useLRRReaderConfig();
const readerContainerRef = ref<HTMLDivElement>();

watch(
  () => reader.currentPage,
  () => reader.preloadImagesFromConfig()
);
</script>

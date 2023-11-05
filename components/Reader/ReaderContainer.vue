<template>
  <div :class="`block ${readerConf.fitMode === 'screen-height' ? 'min-h-screen w-auto' : 'h-auto min-w-[100vw]'}`">
    <ReaderPaged v-if="readerConf.isPaged" />
  </div>
</template>

<script setup lang="ts">
const reader = useLRRReader();
const readerConf = useLRRReaderConfig();

watch(
  () => reader.currentPage,
  () => reader.preloadImagesFromConfig()
);
</script>

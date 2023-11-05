<template>
  <ReaderPaged v-if="readerConf.isPaged" />
</template>

<script setup lang="ts">
const reader = useLRRReader();
const readerConf = useLRRReaderConfig();

watch(
  () => reader.currentPage,
  () => reader.preloadImagesFromConfig()
);
</script>

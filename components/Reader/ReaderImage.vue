<template>
  <img
    v-if="blobURL"
    :src="blobURL"
    loading="lazy"
    :class="`object-contain ${twClass}`"
    :width="$props.image.width"
    :height="$props.image.height"
    :data-page="$props.image.page"
    :data-original="$props.image.url"
  />
  <div v-else class="min-h-[50vh] w-screen object-contain">
    <!-- Position center vertical/horizontal for spinner -->
    <div class="relative flex h-full w-full items-center justify-center">
      <Icon name="quill:loading-spin" class="h-10 w-10 animate-spin" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  image: LoadedImage;
}>();

const readerConf = useLRRReaderConfig();

const twClass = computed(() => {
  const fitMode = readerConf.fitMode === "screen-height" ? "sh" : "sw";

  if (readerConf.isPaged) {
    return `paged-${fitMode}`;
  }

  return `vertical-${fitMode}`;
});

const blobURL = computed(() => {
  return props.image.blob && URL.createObjectURL(props.image.blob);
});
</script>

<style scoped lang="postcss">
.paged-sh {
  @apply h-screen w-auto;
}
.paged-sw {
  @apply w-full;
}
/* in vertical mode, we use h-auto */
.vertical-sh {
  @apply mx-auto h-auto w-[100vh];
}
.vertical-sw {
  @apply w-full;
}
</style>

<template>
  <img
    :src="blobURL"
    loading="lazy"
    :width="$props.image.width"
    :height="$props.image.height"
    :class="`${readerConf.fitMode === 'screen-height' ? 'h-screen w-auto' : 'h-auto w-screen'}`"
    :data-page="$props.image.page"
    :data-original="$props.image.url"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  image: LoadedImage;
}>();

const readerConf = useLRRReaderConfig();

const blobURL = computed(() => {
  return props.image.blob && URL.createObjectURL(props.image.blob);
});
</script>

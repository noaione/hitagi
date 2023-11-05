<template>
  <img
    :src="blobURL"
    loading="lazy"
    :class="`object-contain ${readerConf.fitMode === 'screen-height' ? 'h-screen w-auto' : 'w-full'}`"
    :width="$props.image.width"
    :height="$props.image.height"
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

<template>
  <img
    v-if="blobURL"
    :src="blobURL"
    loading="lazy"
    :class="`h-full w-auto object-contain ${$props.class ?? ''}`"
    :width="$props.image.width"
    :height="$props.image.height"
    :data-page="$props.image.page"
    :data-original="$props.image.url"
  />
  <div v-else :class="`flex h-full min-h-screen w-full object-contain ${$props.class ?? ''}`">
    <div class="m-auto"><Icon name="quill:loading-spin" class="h-10 w-10 animate-spin" /></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  image: LoadedImage;
  class?: string;
}>();

const blobURL = computed(() => {
  return props.image.blob && URL.createObjectURL(props.image.blob);
});
</script>

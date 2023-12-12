<template>
  <img
    v-if="blobURL"
    :src="blobURL"
    loading="lazy"
    :width="$props.image.width"
    :height="$props.image.height"
    :data-page="$props.image.page"
    :data-original="$props.image.url"
  />
  <div v-else class="h-full w-full object-contain">Loading</div>
</template>

<script setup lang="ts">
const props = defineProps<{
  image: LoadedImage;
}>();

const blobURL = computed(() => {
  return props.image.blob && URL.createObjectURL(props.image.blob);
});
</script>

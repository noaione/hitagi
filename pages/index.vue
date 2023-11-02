<template>
  <p>Hello</p>
</template>

<script setup lang="ts">
const settings = useSettings();
settings.defaults();

onMounted(() => {
  useSeoMeta({
    title: "Hitagi",
    ogTitle: "Hitagi",
    description: `A "modern" LANraragi web client`,
    ogDescription: `A "modern" LANraragi web client`,
    ogImage: "/hitagi-hero.png",
    twitterCard: "summary_large_image"
  });
});
</script>

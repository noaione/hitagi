<template>
  <p>Hello</p>
</template>

<script setup lang="ts">
onMounted(() => {
  useSeoMeta({
    title: "Home :: Hitagi",
    ogTitle: "Hitagi",
    description: `A "modern" LANraragi web client`,
    ogDescription: `A "modern" LANraragi web client`,
    ogImage: "/hitagi-hero.png",
    twitterCard: "summary_large_image"
  });
});
</script>

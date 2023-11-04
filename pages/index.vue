<template>
  <div class="flex flex-col gap-2">
    <h1 class="glow-text-lg mb-2 text-2xl font-bold text-hitagi-700 shadow-hitagi-400 dark:text-hitagi-200">
      Recommended
    </h1>
    <ListingRecommendedView class="mb-4" />
  </div>
</template>

<script setup lang="ts">
onMounted(() => {
  useSeoMeta({
    title: "Home :: Hitagi",
    ogTitle: "Hitagi",
    description: `A "modern" LANraragi web client`,
    ogDescription: `A "modern" LANraragi web client`,
    ogImage: "/hitagi-hero.png",
    twitterCard: "summary_large_image",
  });
});
</script>

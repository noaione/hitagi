<template>
  <div class="flex flex-col gap-2">
    <h1 class="mb-2 text-2xl font-bold text-themed-700 shadow-themed-400 glow-text-lg dark:text-themed-200">
      Recommended
    </h1>
    <ListingRecommendedView class="mb-4" />
    <div class="mb-2 flex flex-row justify-between">
      <h1 class="text-2xl font-bold text-themed-700 shadow-themed-400 glow-text-lg dark:text-themed-200">Listing</h1>
      <ListingArchiveNavigation container-class="hidden md:block" @open-page="pageModal = true" />
      <ListingArchiveOptions />
    </div>
    <ListingArchiveView class="mb-2" />
    <div class="mb-4 flex flex-row items-center justify-center">
      <ListingArchiveNavigation @open-page="pageModal = true" />
    </div>
  </div>
  <ModalArchivePageSelector
    v-model:pair="search.pageSelectorIndex"
    v-model:open="pageModal"
    :max-page="search.maxPage"
  />
</template>

<script setup lang="ts">
const search = useLRRSearch();

const pageModal = ref(false);

onMounted(() => {
  search
    .getAvailableTags()
    .then(() => {
      search.search(0);
    })
    .catch((error) => {
      console.error(error);
      search.search(0);
    });

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

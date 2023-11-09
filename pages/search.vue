<template>
  <div class="flex flex-col gap-2">
    <SearchBar class="mt-2" :initial-query="initialSearch" />
    <h1 class="glow-text-lg mb-2 text-2xl font-bold text-hitagi-700 shadow-hitagi-400 dark:text-hitagi-200">
      Recommended
    </h1>
    <ListingRecommendedView class="mb-4" search-mode />
    <div class="mb-2 flex flex-row justify-between">
      <h1 class="glow-text-lg text-2xl font-bold text-hitagi-700 shadow-hitagi-400 dark:text-hitagi-200">Listing</h1>
      <ListingArchiveNavigation container-class="hidden md:block" @open-page="pageModal = true" />
      <ListingArchiveOptions />
    </div>
    <ListingArchiveView class="mb-2" />
    <div class="mb-4 flex flex-row items-center justify-center">
      <ListingArchiveNavigation @open-page="pageModal = true" />
    </div>
  </div>
  <ModalArchivePageSelector
    v-model:page="search.pageSelectorIndex"
    v-model:open="pageModal"
    :max-page="search.maxPage"
  />
</template>

<script setup lang="ts">
const route = useRoute();
const search = useLRRSearch();

const initialSearch = ref("");
const pageModal = ref(false);

onMounted(() => {
  search.getAvailableTags();

  const querySearch = route.query.q;

  const initSearch = (Array.isArray(querySearch) ? querySearch.join(", ") : querySearch?.toString()) ?? "";

  if (initSearch) {
    initialSearch.value = initSearch;

    nextTick(() => {
      search.filter = initSearch;
      search.search(0);
    });
  }

  useSeoMeta({
    title: "Search :: Hitagi",
    ogTitle: "Hitagi",
    description: `A "modern" LANraragi web client`,
    ogDescription: `A "modern" LANraragi web client`,
    ogImage: "/hitagi-hero.png",
    twitterCard: "summary_large_image",
  });
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-row items-center justify-between">
      <h1 class="mb-2 text-2xl font-bold text-themed-700 shadow-themed-400 glow-text-lg dark:text-themed-200">
        Recommended
      </h1>
      <div class="flex flex-row items-center">
        <button
          class="text-themed-700 shadow-themed-400 transition glow-text-lg hover:opacity-80 dark:text-themed-300"
          :disabled="refreshState"
          @click="doReload"
        >
          <Icon name="mdi:refresh" :class="`h-8 w-8 ${refreshState ? 'animate-spin' : ''}`" />
        </button>
        <ListingRecommendedMode />
      </div>
    </div>
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
const recommend = useLRRRecommended();

const pageModal = ref(false);
const refreshState = ref(false);

async function doReload() {
  refreshState.value = true;

  await recommend.reload();

  refreshState.value = false;
}

onMounted(async () => {
  useSeoMeta({
    title: "Home :: Hitagi",
    ogTitle: "Hitagi",
    description: `A "modern" LANraragi web client`,
    ogDescription: `A "modern" LANraragi web client`,
    ogImage: "/hitagi-hero.png",
    twitterCard: "summary_large_image",
  });

  await search.search(0);
});
</script>

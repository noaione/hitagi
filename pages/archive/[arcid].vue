<template>
  <div class="mt-2 flex w-full flex-row gap-4" v-if="data">
    <div class="aspect-thumb flex flex-col">
      <img :src="thumbnail" alt="Thumbnail" class="h-auto w-96 rounded-md object-contain" />
    </div>
    <div class="flex flex-col">
      <h2 class="mb-2 text-2xl font-bold">{{ data.metadata.title }}</h2>
      <div class="mb-4 flex flex-row items-center">
        <div
          class="mr-2 flex items-center rounded-md bg-blue-500 px-1 py-0.5 align-middle text-sm font-semibold uppercase text-white"
          v-if="boolStrToBool(data.metadata.isnew)"
        >
          NEW
        </div>
        <div class="text-sm">{{ data.metadata.pagecount.toLocaleString() }} pages</div>
      </div>
      <ArchiveInfoBtn class="mb-4" :arc-id="String($route.params.arcid)" />
      <hr class="mb-4 w-full border-hitagi-400" />
      <ArchiveTags :tags="data.metadata.tags.split(',')" />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const settings = useServerMeta();

function setSEO(metadata: LRRArchiveMetadata) {
  const arcId = route.params.arcid;
  useSeoMeta({
    title: metadata.title + " :: Hitagi",
    ogTitle: metadata.title + " - Hitagi",
    ogDescription: metadata.tags.split(",").join(", "),
    ogImage: `${settings.hostURL.origin}/api/archives/${arcId}/thumbnail`,
    twitterCard: "summary_large_image"
  });
}

const { data } = await useAsyncData(
  `archive-info-${route.params.arcid}`,
  async () => {
    const arcId = route.params.arcid;
    const metadataLRR = useLRR<LRRArchiveMetadata>(`/archives/${arcId}/metadata`);
    const categoriesLRR = useLRR<LRRArchiveCategories>(`/archives/${arcId}/categories`);
    const [metadata, categories] = await Promise.all([metadataLRR, categoriesLRR]);
    setSEO(metadata);

    return {
      metadata,
      categories
    };
  },
  {
    watch: [() => route.params.arcid]
  }
);

const thumbnail = computed(() => {
  const arcId = route.params.arcid;
  return `${settings.hostURL.origin}/api/archives/${arcId}/thumbnail`;
});
</script>

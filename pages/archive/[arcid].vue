<template>
  <div class="mt-2 flex w-full flex-col gap-4 md:flex-row" v-if="data">
    <div class="aspect-thumb mx-auto block h-96 w-64 justify-center md:mx-0 md:h-[34rem] md:w-96">
      <img
        :src="thumbnail"
        alt="Thumbnail"
        :class="`h-full rounded-md ${
          settings.thumbFit === 'contain' ? 'object-contain object-center' : 'object-cover object-right'
        }`"
      />
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

const settings = useLRRConfig();
const serverMeta = useServerMeta();

function setSEO(metadata: LRRArchiveMetadata) {
  const arcId = route.params.arcid;
  useSeoMeta({
    title: metadata.title + " :: Hitagi",
    ogTitle: metadata.title + " - Hitagi",
    ogDescription: metadata.tags.split(",").join(", "),
    ogImage: `${serverMeta.hostURL.origin}/api/archives/${arcId}/thumbnail`,
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
  return `${serverMeta.hostURL.origin}/api/archives/${arcId}/thumbnail`;
});
</script>

<template>
  <div class="mt-2 flex w-full flex-col gap-4 md:flex-row" v-if="data">
    <ArchiveThumb :arc-id="String($route.params.arcid)" class="mx-auto h-96 w-64 md:mx-0 md:h-[34rem] md:w-96" />
    <div class="flex flex-col">
      <h2 class="mb-2 text-2xl font-bold text-hitagi-600 dark:text-hitagi-400">{{ data.metadata.title }}</h2>
      <div class="mb-4 flex flex-row items-center text-hitagi-700 dark:text-hitagi-300">
        <LinkablePill class="mr-2 font-semibold uppercase transition-opacity hover:opacity-80" color="blue" outlined>
          NEW
        </LinkablePill>
        <div class="text-sm">{{ data.metadata.pagecount.toLocaleString() }} pages</div>
        <div class="mx-2 text-sm" v-if="dateAdded">|</div>
        <ArchiveUnix v-if="dateAdded" :unix="dateAdded" text="Added on" class="text-sm" inner-class="font-semibold" />
      </div>
      <ArchiveInfoBtn class="mb-4" :arc-id="String($route.params.arcid)" />
      <hr class="mb-4 w-full border-hitagi-400" />
      <ArchiveTags :tags="data.metadata.tags.split(',')" :unrender="['date_added']" />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

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

const dateAdded = computed(() => {
  const tagsData = data?.value?.metadata?.tags;
  if (isNone(tagsData)) return undefined;

  const tags = tagsData.split(",");
  const date = tags.find((tag) => tag.startsWith("date_added:"));
  if (isNone(date)) return undefined;

  return Number.parseInt(date.split(":", 2)[1]);
});
</script>

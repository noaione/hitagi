<template>
  <div v-if="data" class="mt-2 flex w-full flex-col gap-4 md:flex-row">
    <ArchiveThumb :arc-id="String($route.params.arcid)" class="mx-auto h-96 w-64 md:mx-0 md:h-[34rem] md:w-96" />
    <div class="flex flex-col">
      <h2 class="mb-2 text-2xl font-bold text-themed-600 dark:text-themed-400">{{ data.metadata.title }}</h2>
      <div class="mb-4 flex flex-row items-center text-themed-700 dark:text-themed-300">
        <LinkablePill
          v-if="boolStrToBool(data.metadata.isnew)"
          class="mr-2 font-semibold uppercase transition-opacity hover:opacity-80"
          color="blue"
          outlined
        >
          NEW
        </LinkablePill>
        <div class="text-sm">{{ data.metadata.pagecount.toLocaleString() }} pages</div>
        <div v-if="dateAdded" class="mx-2 text-sm">|</div>
        <ArchiveUnix v-if="dateAdded" :unix="dateAdded" text="Added on" class="text-sm" inner-class="font-semibold" />
      </div>
      <ArchiveInfoBtn class="mb-4" :arc-id="String($route.params.arcid)" />
      <hr class="mb-4 w-full border-themed-400" />
      <ArchiveTags :tags="data.metadata.tags.split(',')" :unrender="['date_added']" />
    </div>
  </div>
  <div v-if="data && data.metadata.pagecount > 1" class="mt-4 flex w-full flex-col">
    <h2 class="mb-6 text-2xl font-bold text-themed-700 shadow-themed-400 glow-text-lg dark:text-themed-200">Pages</h2>
    <ArchivePages :arc-id="data.metadata.arcid" :total-pages="data.metadata.pagecount" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const toaster = useHitagiToast();
const serverMeta = useServerMeta();

function setSEO(metadata: LRRArchiveMetadata) {
  const arcId = route.params.arcid;

  useSeoMeta({
    title: metadata.title + " :: Hitagi",
    ogTitle: metadata.title + " - Hitagi",
    ogDescription: metadata.tags.split(",").join(", "),
    ogImage: `${serverMeta.hostURL.origin}/api/archives/${arcId}/thumbnail`,
    twitterCard: "summary_large_image",
  });
}

const { data, error } = await useAsyncData(
  `archive-info-${route.params.arcid}`,
  async () => {
    const arcId = route.params.arcid;
    const metadataLRR = useLRR<LRRArchiveMetadata>(`/archives/${arcId}/metadata`);
    const categoriesLRR = useLRR<LRRArchiveCategories>(`/archives/${arcId}/categories`);
    const [metadata, categories] = await Promise.all([metadataLRR, categoriesLRR]);

    setSEO(metadata);

    return {
      metadata,
      categories,
    };
  },
  {
    watch: [() => route.params.arcid],
  }
);

if (error.value instanceof Error) {
  // check caused by
  // - FetchError
  if (error.value.cause instanceof FetchError) {
    const errorMsg: string = error.value.cause.response?._data?.error ?? error.value.message;

    if (errorMsg.toLowerCase().includes("this id doesn't")) {
      throw createError({
        statusCode: 404,
        statusMessage: `Archive ${route.params.arcid} not found`,
        data: {
          arcid: String(route.params.arcid),
          from: "archive-edit",
        },
        fatal: true,
      });
    } else {
      toaster.toast({
        title: "Failed to load archive",
        message: errorMsg,
        type: "error",
      });
    }
  } else {
    toaster.toast({
      title: "Unknown error",
      message: "Please see the console for more information.",
      type: "error",
    });
    console.error(error.value);
  }
}

const dateAdded = computed(() => {
  const tagsData = data?.value?.metadata?.tags;

  if (isNone(tagsData)) return;

  const tags = tagsData.split(",");
  const date = tags.find((tag) => tag.startsWith("date_added:"));

  if (isNone(date)) return;

  return Number.parseInt(date.split(":", 2)[1]);
});
</script>

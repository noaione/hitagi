<template>
  <div v-if="data" class="mt-2 flex w-full flex-col gap-4 md:flex-row">
    <ArchiveThumb :arc-id="String($route.params.arcid)" class="mx-auto h-96 w-64 md:mx-0 md:h-[34rem] md:w-96" />
    <div class="flex flex-col">
      <HitagiInput
        v-model="titleEdit"
        input-id="title"
        container-class="server-width"
        type="text"
        :minlength="1"
        :required="true"
        :disabled="submitting"
      >
        <template #label>
          <label for="title" class="font-medium text-themed-700 dark:text-themed-300">Title</label>
        </template>
      </HitagiInput>
      <span class="font-sm uppercase text-gray-300 dark:text-hitagi-700">ID: {{ data.metadata.arcid }}</span>
      <div class="flex flex-col gap-1">
        <label class="font-medium text-themed-700 dark:text-themed-300">Tags</label>
        <ArchiveTagsEditor v-model:tags="tagsEdit" container-class="w-full" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const serverMeta = useServerMeta();

const titleEdit = ref<string>("");
const tagsEdit = ref<string[]>([]);
const submitting = ref(false);

function setSEO(metadata: LRRArchiveMetadata) {
  const arcId = route.params.arcid;

  useSeoMeta({
    title: metadata.title + " - Edit :: Hitagi",
    ogTitle: metadata.title + " - Edit - Hitagi",
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

    titleEdit.value = metadata.title;
    tagsEdit.value = metadata.tags.split(",");

    return {
      metadata,
      categories,
    };
  },
  {
    watch: [() => route.params.arcid],
  }
);

watch(
  () => error.value,
  (newError) => {
    if (newError instanceof FetchError && newError.status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: `Archive ${route.params.arcid} not found`,
        data: {
          arcid: String(route.params.arcid),
          from: "archive-edit",
        },
      });
    }
  }
);

definePageMeta({
  middleware: "auth",
});
</script>

<style scoped lang="postcss">
.server-width {
  @apply w-[90%] md:w-[60%] lg:w-[30%];
}
</style>

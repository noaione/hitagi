<template>
  <ReaderViewWrapper v-if="data" :metadata="data.metadata" @open-modal="modalReader = true" />
  <ErrorViewer v-if="error && !pending">
    {{ error.message }}
  </ErrorViewer>
  <ModalReaderSettings v-model:open="modalReader" />
</template>

<script setup lang="ts">
const route = useRoute();

const reader = useLRRReader();
const readerConf = useLRRReaderConfig();
const serverMeta = useServerMeta();
const toaster = useHitagiToast();
const modalReader = ref(false);

function setSEO(metadata: LRRArchiveMetadata) {
  const arcId = route.params.arcid;

  useSeoMeta({
    title: metadata.title + " :: Read :: Hitagi",
    ogTitle: metadata.title + " - Read at Hitagi",
    ogDescription: metadata.tags.split(",").join(", "),
    ogImage: `${serverMeta.hostURL.origin}/api/archives/${arcId}/thumbnail`,
    twitterCard: "summary_large_image",
  });
}

const { data, error, pending, execute } = await useAsyncData(
  `archive-read-${route.params.arcid}`,
  async () => {
    const arcId = route.params.arcid;
    const metadataLRR = useLRR<LRRArchiveMetadata>(`/archives/${arcId}/metadata`);
    const filesLRR = useLRR<LRRArchiveFiles>(`/archives/${arcId}/files`);
    const [metadata, files] = await Promise.all([metadataLRR, filesLRR]);

    setSEO(metadata);

    return {
      metadata,
      files,
    };
  },
  {
    watch: [() => route.params.arcid],
    immediate: false,
  }
);

function showNavigationAndClose() {
  reader.navigationBar = true;

  setTimeout(() => {
    reader.navigationBar = false;
  }, 2000);
}

onKeyStroke("Escape", () => {
  if (readerConf.firstTimeHint) {
    readerConf.firstTimeHint = false;

    return;
  }

  if (modalReader.value) {
    modalReader.value = false;
  }
});

onMounted(() => {
  // fetch and wait
  // then set startPage
  execute()
    .then(() => {
      if (isNone(data.value)) {
        return;
      }

      reader.populate(data.value.files.pages);
      console.log("reader ready");
      reader.screenSpy = true;
      showNavigationAndClose();

      const queryPage = Number(route.query.page);

      if (Number.isNaN(queryPage)) {
        reader.updatePage(1);
      } else {
        if (queryPage < 1) {
          reader.updatePage(1);

          return;
        } else if (data.value && queryPage > data.value.metadata.pagecount) {
          reader.updatePage(data.value.metadata.pagecount);

          return;
        } else {
          reader.updatePage(queryPage);
        }
      }

      reader.loadCurrent();
      reader.preloadImagesFromConfig();
    })
    .catch((error) => {
      if (error.value instanceof Error) {
        if (error.value.cause instanceof FetchError) {
          const errorMsg: string = error.value.cause.response?._data?.error ?? error.value.message;

          if (errorMsg.toLowerCase().includes("this id doesn't")) {
            throw createError({
              statusCode: 404,
              statusMessage: `Archive ${route.params.arcid} not found`,
              data: {
                arcid: String(route.params.arcid),
                from: "archive-read",
                layout: "clean",
              },
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
    });
});

definePageMeta({
  layout: "clean",
});
</script>

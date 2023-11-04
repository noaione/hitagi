<template>
  <div v-if="data" class="flex flex-col">
    <div class="mb-auto block">
      <ReaderNavBar
        :arc-id="data.metadata.arcid"
        :page="currentPage"
        :max-page="data.metadata.pagecount"
        @update-page="updatePage"
      />
    </div>
    <ReaderContainer :arc-id="data.metadata.arcid" :images="data.files.pages" @update-page="updatePage" />
    <div class="mt-auto block">
      <ReaderNavBar
        :arc-id="data.metadata.arcid"
        :page="currentPage"
        :max-page="data.metadata.pagecount"
        @update-page="updatePage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const serverMeta = useServerMeta();
const readerConfig = useLRRReaderConfig();

const currentPage = ref(1);

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

const { data, execute } = await useAsyncData(
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

// Use inject/provide to pass updated page number (from nav bar) to reader container
provide(LRRReaderPage, readonly(currentPage));

function updatePage(page: number) {
  currentPage.value = page;
  // update query without reloading
  router.replace({
    query: {
      page: page,
    },
  });
}

function kbdMoveLeft() {
  if (currentPage.value > 1) {
    updatePage(currentPage.value - 1);
  }
}

function kbdMoveRight() {
  if (data.value && currentPage.value < data.value.metadata.pagecount) {
    updatePage(currentPage.value + 1);
  }
}

onKeyStroke(["ArrowLeft", "ArrowUp"], (e) => {
  // allow arrow up only in vertical mode
  if (e.key === "ArrowUp" && readerConfig.flow !== "vertical") {
    return;
  }

  e.preventDefault();

  if (readerConfig.flow === "rtl") {
    kbdMoveRight();
  } else {
    kbdMoveLeft();
  }
});

onKeyStroke(["ArrowRight", "ArrowDown"], (e) => {
  // allow arrow down only in vertical mode
  if (e.key === "ArrowDown" && readerConfig.flow !== "vertical") {
    return;
  }

  e.preventDefault();

  if (readerConfig.flow === "rtl") {
    kbdMoveLeft();
  } else {
    kbdMoveRight();
  }
});

onMounted(() => {
  // fetch and wait
  // then set startPage
  execute()
    .then(() => {
      console.log("reader ready");

      const queryPage = Number(route.query.page);

      if (Number.isNaN(queryPage)) {
        updatePage(1);
      } else {
        if (queryPage < 1) {
          updatePage(1);

          return;
        } else if (data.value && queryPage > data.value.metadata.pagecount) {
          updatePage(data.value.metadata.pagecount);

          return;
        } else {
          updatePage(queryPage);
        }
      }
    })
    .catch((error) => {
      console.error(error);
      router.push("/500");
    });
});

definePageMeta({
  layout: "clean",
});
</script>

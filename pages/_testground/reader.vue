<template>
  <ReaderViewWrapper :metadata="metadata" @open-modal="modalReader = true" />
  <ModalReaderSettings v-model:open="modalReader" />
</template>

<script setup lang="ts">
const route = useRoute();
const reader = useLRRReader();

definePageMeta({
  layout: "clean",
});

const modalReader = ref(false);

const metadata: LRRArchiveMetadata = {
  arcid: "d7246c2ccbcd106baed2b6c067c7267657416c65",
  // extension: "zip",
  isnew: "true",
  lastreadtime: 0,
  pagecount: 26,
  progress: 0,
  tags: "date_added:1699178047,female:big breasts,female:cunnilingus,female:females only,female:fingering,female:hairy,female:loli,female:tribadism,female:yuri,artist:iwami shouko,group:anzen daiichi,character:abigail williams,character:katsushika hokusai,language:japanese,source:https://hitomi.la/galleries/1569405.html,series:fate series",
  title: "今日はお泊りの日だから | Kyou wa Otomari no Hi dakara | Today Is the Day I Stayed",
};

const filesMeta = {
  job: 1219,
  pages: [
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_01_1.56_MB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_02_1.38_MB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_03_1.46_MB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_04_878.47_KB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_05_702.84_KB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_06_863.19_KB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_07_678.74_KB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_08_918.55_KB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_09_940.94_KB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_10_942.23_KB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_11_683.30_KB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_12_1.00_MB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_13_878.71_KB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_14_1.10_MB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_15_776.53_KB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_16_787.42_KB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_17_1.02_MB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_18_1.17_MB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_19_1.10_MB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_20_1.10_MB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_21_1005.74_KB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_22_1.66_MB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_23_1.25_MB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_24_815.02_KB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_25_73.56_KB.png",
    "./api/archives/d7246c2ccbcd106baed2b6c067c7267657416c65/page?path=img_26_155.98_KB.png",
  ],
};

onMounted(() => {
  reader.clear();
  reader.populate(filesMeta.pages);

  console.log("reader ready");

  const queryPage = Number(route.query.page);

  if (Number.isNaN(queryPage)) {
    reader.updatePage(1);
  } else {
    if (queryPage < 1) {
      reader.updatePage(1);

      return;
    } else if (queryPage > metadata.pagecount) {
      reader.updatePage(metadata.pagecount);

      return;
    } else {
      reader.updatePage(queryPage);
    }
  }

  reader.preloadImagesFromConfig();
});
</script>

<!-- Vertical Reader -->
<template>
  <div v-if="reader.pairedImages.length > 0" ref="root" class="flex flex-col overflow-x-hidden overflow-y-scroll">
    <div
      v-for="(item, index) in reader.pairedImages"
      :key="`parent-${item[0].url}`"
      v-in-view="[whenInView, { root, threshold: 0.5 }]"
      :class="`flex ${readerConf.flow === 'webtoon' ? 'flex-col' : 'flex-row'} justify-center`"
      :style="getPaddingForPage(index, reader.pairedImages.length)"
      :data-pair-index="index"
    >
      <ReaderImage v-for="img in item" :id="`page-${img.page}`" :key="img.url" :image="img" />
    </div>
  </div>
  <div v-else class="h-full w-full object-contain" />
</template>

<script setup lang="ts">
import type { StyleValue } from "vue";

const root = ref();
const reader = useLRRReader();
const readerConf = useLRRReaderConfig();

function getPaddingForPage(index: number, totalIndex: number): StyleValue | undefined {
  if (readerConf.flow !== "vertical") {
    return;
  }

  if (index === 0) {
    return {
      paddingBottom: `${readerConf.padding}%`,
    };
  }

  if (index === totalIndex - 1) {
    return {
      paddingTop: `${readerConf.padding}%`,
    };
  }

  return {
    paddingTop: index === 0 ? undefined : `${readerConf.padding}%`,
    paddingBottom: index === totalIndex - 1 ? undefined : `${readerConf.padding}%`,
  };
}

function whenInView(el: HTMLElement) {
  const pairIndex = Number(el.dataset.pairIndex);

  if (Number.isNaN(pairIndex)) {
    return;
  }

  const pairData = reader.pairedImages[pairIndex];

  if (pairData && pairData[0].page !== reader.currentPage) {
    reader.updatePage(pairData[0].page);
  }
}

onMounted(() => {
  // on mounted, we need to set the scroll position to the target page.

  if (reader.pairedImages.length > 0) {
    const targetPage = reader.currentPage;

    const targetEl = document.querySelector(`#page-${targetPage}`);

    if (targetEl) {
      console.log("Scrolling to", targetPage);

      targetEl.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }
});
</script>

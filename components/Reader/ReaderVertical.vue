<!-- Vertical Reader -->
<template>
  <div v-if="reader.pairedImages.length > 0" class="flex flex-col overflow-x-hidden overflow-y-scroll">
    <div
      v-for="item in reader.pairedImages"
      :key="`parent-${item[0].url}`"
      :class="`flex ${readerConf.flow === 'webtoon' ? 'flex-col' : 'flex-row'} justify-center`"
      :style="paddingStyles"
    >
      <ReaderImage v-for="img in item" :id="`page-${img.page}`" :key="img.url" :image="img" />
    </div>
  </div>
  <div v-else class="h-full w-full object-contain" />
</template>

<script setup lang="ts">
import type { StyleValue } from "vue";

const reader = useLRRReader();
const readerConf = useLRRReaderConfig();

const paddingStyles = computed((): StyleValue | undefined => {
  if (readerConf.flow === "vertical") {
    // Padding number is percentage from 5-30% with stepping of 5.
    return {
      paddingTop: `${readerConf.padding}%`,
      paddingBottom: `${readerConf.padding}%`,
    };
  }

  return;
});

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

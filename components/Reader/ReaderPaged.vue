<template>
  <div
    v-if="item"
    class="grid h-full w-full grid-rows-1 justify-center gap-0 object-contain"
    :style="gridStyles(item.length)"
    :class="{
      'max-h-screen': readerConf.fitMode === 'screen-height',
    }"
  >
    <ReaderImage
      v-for="(img, idx) in item"
      :key="img.url"
      :image="img"
      :class="`mx-auto ${item.length > 1 ? (idx === 0 ? 'mr-0' : 'ml-0') : ''}`"
    />
  </div>
</template>

<script setup lang="ts">
const reader = useLRRReader();
const readerConf = useLRRReaderConfig();

function gridStyles(indexLength: number) {
  return {
    gridTemplateColumns: `repeat(${indexLength}, minmax(0, 1fr))`,
  };
}

const item = computed(() => {
  const current = reader.pairedImages[reader.currentPairIndex];

  if (!current) return;

  return readerConf.flow === "rtl" ? current.reverse() : current;
});
</script>

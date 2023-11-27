<template>
  <div :class="`absolute left-0 top-0 h-screen w-[35%] ${spyPrevInfo.className} backdrop-blur-md`">
    <div class="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 transform-gpu">
      <div class="text-2xl font-bold text-white">
        <p class="text-shadow-md select-none uppercase shadow-black">
          {{ spyPrevInfo.text }}
        </p>
      </div>
    </div>
  </div>
  <div :class="`absolute left-[65%] top-0 h-screen w-[35%] ${spyNextInfo.className} backdrop-blur-md`">
    <div class="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 transform-gpu">
      <div class="text-2xl font-bold text-white">
        <p class="text-shadow-md select-none uppercase shadow-black">
          {{ spyNextInfo.text }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const readerConf = useLRRReaderConfig();

const spyPrevInfo = computed(() => {
  return {
    className: readerConf.isPaged ? (readerConf.flow === "ltr" ? "sspy-prev-bg" : "sspy-next-bg") : "sspy-prev-bg",
    text: readerConf.isPaged ? (readerConf.flow === "ltr" ? "Previous" : "Next") : "Previous",
  };
});
const spyNextInfo = computed(() => {
  return {
    className: readerConf.isPaged ? (readerConf.flow === "ltr" ? "sspy-next-bg" : "sspy-prev-bg") : "sspy-next-bg",
    text: readerConf.isPaged ? (readerConf.flow === "ltr" ? "Next" : "Previous") : "Next",
  };
});
</script>

<style scoped lang="postcss">
.sspy-next-bg {
  @apply bg-green-500 bg-opacity-50;
}
.sspy-prev-bg {
  @apply bg-red-500 bg-opacity-50;
}
</style>

<template>
  <Carousel
    v-if="reader.pairedImages.length > 0"
    ref="carouselRef"
    v-model="reader.currentPairIndex"
    :wrap-around="false"
    :items-to-show="1"
    :dir="readerConf.isPaged ? (readerConf.flow as 'ltr' | 'rtl') : 'ltr'"
    :touch-drag="false"
    :mouse-drag="false"
    snap-align="center"
  >
    <Slide v-for="item in reader.pairedImages" :key="'parent-' + item[0].url">
      <ReaderImage v-for="img in item" :key="img.url" :image="img" />
    </Slide>
  </Carousel>
  <div v-else class="h-full w-full object-contain" />
</template>

<script setup lang="ts">
const reader = useLRRReader();
const readerConf = useLRRReaderConfig();
</script>

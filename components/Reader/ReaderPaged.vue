<template>
  <Carousel
    v-if="reader.pairedImages.length > 0"
    ref="carouselRef"
    :wrap-around="false"
    :items-to-show="1"
    :dir="readerConf.isPaged ? (readerConf.flow as 'ltr' | 'rtl') : 'ltr'"
    snap-align="center"
    @slide-end="handleImageSlide"
  >
    <Slide v-for="item in reader.pairedImages" :key="'parent-' + item[0].url">
      <ReaderImage v-for="img in item" :key="img.url" :image="img" />
    </Slide>
  </Carousel>
  <div v-else :class="readerConf.fitMode === 'screen-height' ? 'min-h-screen w-auto' : 'h-auto min-w-[100vw]'" />
</template>

<script setup lang="ts">
type ImageSlideEnd = {
  currentSlideIndex: number;
  previousSlideIndex: number;
  slidesCount: number;
};

type CarouselRefFunc = {
  next: () => void;
  prev: () => void;
  slideTo: (index: number) => void;
};

const reader = useLRRReader();
const readerConf = useLRRReaderConfig();
const carouselRef = ref<CarouselRefFunc>();
const currentSlide = ref<number>(0);

function handleImageSlide(data: ImageSlideEnd) {
  currentSlide.value = data.currentSlideIndex;

  nextTick(() => {
    const imgPair = reader.pairedImages[data.currentSlideIndex];

    reader.updatePage(imgPair.map((img) => img.page));
  });
}

watch(
  () => reader.currentPage,
  (newPage) => {
    // find the iamges that match in paired images
    const pairedImageIndex = reader.pairedImages.findIndex(
      (item) => item.findIndex((img) => img.page === newPage) !== -1
    );

    if (pairedImageIndex !== -1 && pairedImageIndex !== currentSlide.value) {
      carouselRef.value?.slideTo(pairedImageIndex);
    }
  }
);
</script>

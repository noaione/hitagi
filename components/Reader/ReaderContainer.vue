<template>
  <Carousel
    v-if="data.length > 0"
    ref="carouselRef"
    :wrap-around="true"
    :items-to-show="1"
    :dir="readerConf.flow === 'vertical' ? 'ltr' : readerConf.flow"
    snap-align="center"
    @slide-end="handleImageSlide"
  >
    <Slide v-for="item in data" :key="item">
      <img :src="item" loading="lazy" class="h-screen w-auto" />
    </Slide>
  </Carousel>
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

const images = defineProps<{
  arcId: string;
  images: string[];
}>();

const emits = defineEmits<{
  (e: "updatePage", page: number): void;
}>();

const readerConf = useLRRReaderConfig();
const serverMeta = useServerMeta();
const carouselRef = ref<CarouselRefFunc>();
const data = ref<string[]>([]);
const currentSlide = ref<number>(0);

const activePage = inject(LRRReaderPage) as Ref<number>;

function handleImageSlide(data: ImageSlideEnd) {
  currentSlide.value = data.currentSlideIndex;
  nextTick(() => {
    emits("updatePage", data.currentSlideIndex + 1);
  });
}

watch(
  () => activePage.value,
  (newPage) => {
    if (newPage !== currentSlide.value + 1) {
      carouselRef.value?.slideTo(newPage - 1);
    }
  }
);

onMounted(() => {
  const imageArray: string[] = [];

  for (let i = 0; i < images.images.length; i++) {
    const imgUrl = images.images[i].replace(/^.\//, serverMeta.hostURL.origin + "/");

    imageArray.push(imgUrl);
  }

  data.value = imageArray;
});
</script>

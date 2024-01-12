<template>
  <div v-if="recommended.data && recommended.data.length > 0" :class="`block ${$props.class ?? ''}`">
    <Carousel :wrap-around="true" :items-to-show="itemsToShow" snap-align="start" :items-to-scroll="2" :autoplay="5000">
      <Slide v-for="item in recommended.data" :key="item.arcid">
        <ArchiveGridInfo :data="item" class="shadow-lg" compact />
      </Slide>
    </Carousel>
  </div>
  <ListingLoadingIndicator
    v-else-if="recommended.data && recommended.data.length === 0"
    :pending="false"
    :class="$props.class"
  />
  <ListingLoadingIndicator v-else :pending="recommended.loading" :class="$props.class" />
</template>

<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core";

type BreakpointReturn = {
  xs: boolean;
  xse: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  xxl: boolean;
  xxxl: boolean;
  xxxxl: boolean;
};

const props = defineProps<{
  class?: string;
  searchMode?: boolean;
}>();

const settings = useLRRConfig();
const recommended = useLRRRecommended();
const searchQuery = useLRRSearch();

const breakspointsTwCustom = {
  ...breakpointsTailwind,
  "3xl": 1800,
  "4xl": 2000,
};

const breakpoints = useBreakpoints(breakspointsTwCustom);

const computeBreakpoints = computed(() => {
  const xs = breakpoints.smallerOrEqual("sm").value;
  const sm = breakpoints.between("sm", "md").value;
  const md = breakpoints.between("md", "lg").value;
  const lg = breakpoints.between("lg", "xl").value;
  const xl = breakpoints.between("xl", "2xl").value;
  const xxl = breakpoints.between("2xl", "3xl").value;
  const xxxl = breakpoints.greaterOrEqual("3xl").value;
  const xxxxl = breakpoints.greaterOrEqual("4xl").value;

  return {
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
    xxxl,
    xxxxl,
  } as BreakpointReturn;
});

const itemsToShow = computed(() => {
  const mappings = {
    xs: 2.4,
    sm: 3.8,
    md: 4.1,
    lg: 5.1,
    xl: 6.7,
    xxl: 8.3,
    xxxl: 9.6,
    xxxxl: 10.8,
  };

  // find active computed breakpoint, (should be only one)
  const activeBreakpoint = Object.keys(computeBreakpoints.value).find(
    (key) => computeBreakpoints.value[key as keyof BreakpointReturn]
  );

  return mappings[activeBreakpoint as keyof typeof mappings] ?? 2;
});

onMounted(() => {
  if (!props.searchMode) {
    recommended.fetchRandom();
  }
});

watch(
  () => searchQuery.filter,
  () => {
    recommended.reload();
  }
);

watch(
  () => settings.recommended,
  () => {
    recommended.reload();
  }
);
</script>

<style scoped lang="postcss">
.carousel__slide {
  @apply items-start;
}

.carousel__track {
  @apply relative !block;
}
</style>

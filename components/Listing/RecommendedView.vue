<template>
  <div v-if="data" :class="`block ${$props.class ?? ''}`">
    <Carousel :wrap-around="true" :items-to-show="itemsToShow" snap-align="start" :items-to-scroll="2" :autoplay="5000">
      <Slide v-for="item in data" :key="item.arcid">
        <ArchiveGridInfo :data="item" class="shadow-lg" compact />
      </Slide>
    </Carousel>
  </div>
  <div
    v-else
    :class="`my-auto flex h-48 w-full flex-col items-center justify-center rounded-lg bg-hitagi-500 !bg-opacity-20 align-middle backdrop-blur-lg md:h-64 ${
      $props.class ?? ''
    }`"
  >
    <CrabIcon
      class="text-hitagi-700 dark:text-hitagi-300"
      :class="{
        'animate-bounce': pending,
      }"
    />
    <LoadingText
      v-if="pending"
      class="font-incosolata text-sm font-semibold lowercase text-hitagi-700 dark:text-hitagi-300"
    />
    <span v-else class="font-incosolata text-sm font-semibold lowercase text-hitagi-700 dark:text-hitagi-300">
      No Results Found
    </span>
  </div>
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

defineProps<{
  class?: string;
}>();

const settings = useLRRConfig();
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
  const activeBreakpoint = Object.keys(computeBreakpoints.value).filter(
    (key) => computeBreakpoints.value[key as keyof BreakpointReturn]
  );

  console.log(activeBreakpoint);

  return mappings[activeBreakpoint[0] as keyof typeof mappings] ?? 2;
});

const { data, pending, execute } = await useAsyncData(
  `recommended-${settings.recommended}-${searchQuery.filter}`,
  async () => {
    if (settings.recommended === "random") {
      const randomLRR = await useLRR<LRRSearchBase>(`/search/random`, {
        params: {
          filter: searchQuery.filter,
          category: searchQuery.category,
          count: 25,
        },
      });

      return randomLRR.data;
    } else {
      const params: Record<string, string | number> = {
        filter: searchQuery.filter,
        category: searchQuery.category,
        start: -1,
        order: "desc",
        sortby: "date_added",
      };

      if (settings.recommended === "untagged") {
        params.untaggedonly = "true";
      } else if (settings.recommended === "new") {
        params.newonly = "true";
      }

      const searchLRR = await useLRR<LRRSearchArchive>(`/search`, {
        params,
      });

      return searchLRR.data;
    }
  },
  {
    watch: [() => settings.recommended, () => searchQuery.filter, () => searchQuery.category],
    immediate: false,
  }
);

onMounted(() => {
  execute({ dedupe: true });
});
</script>

<style scoped lang="postcss">
.carousel__slide {
  @apply items-start;
}

.carousel__track {
  @apply relative !block;
}
</style>

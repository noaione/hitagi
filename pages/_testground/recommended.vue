<template>
  <div class="flex flex-col gap-2">
    <h1 class="glow-text-lg mb-2 text-2xl font-bold text-hitagi-700 shadow-hitagi-400 dark:text-hitagi-200">
      Recommended
    </h1>
    <ListingRecommendedView />
  </div>
  <div class="flex flex-col">Breakpoints: {{ computeBreakpoints }}</div>
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
</script>

<template>
  <span v-if="isNone(href)" :class="tagStyle">
    <slot />
  </span>
  <NuxtLink v-else :to="href" no-prefetch>
    <span :class="tagStyle">
      <slot />
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import clsx from "clsx";

const props = defineProps<{
  href?: string;
  color?: string;
  class?: string;
  outlined?: boolean;
  size?: keyof typeof sizeMaps;
}>();

const validColors = [
  "themed",
  "hachikuji",
  "shinobu",
  "gray",
  "red",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
  "pink",
  "hitagi",
  "orange",
  "cyan",
  "emerald",
] as const;

type ValidColor = (typeof validColors)[number];

const outlinedColorMaps: Record<ValidColor, string> = {
  themed: "border-themed-500 text-themed-600 dark:text-themed-400 bg-themed-100 dark:bg-themed-950",
  hitagi: "border-hitagi-500 text-hitagi-600 dark:text-hitagi-400 bg-hitagi-100 dark:bg-hitagi-950",
  hachikuji: "border-hachikuji-500 text-hachikuji-600 dark:text-hachikuji-400 bg-hachikuji-100 dark:bg-hachikuji-950",
  shinobu: "border-shinobu-500 text-shinobu-600 dark:text-shinobu-400 bg-shinobu-100 dark:bg-shinobu-950",
  gray: "border-gray-500 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800",
  red: "border-red-500 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950",
  yellow: "border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-950",
  green: "border-green-500 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-950",
  blue: "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950",
  indigo: "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950",
  purple: "border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950",
  pink: "border-pink-500 text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-950",
  orange: "border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950",
  cyan: "border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950",
  emerald: "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950",
} as const;

const filledColorMaps: Record<ValidColor, string> = {
  themed: "border-themed-700 bg-themed-700 text-white",
  hitagi: "border-hitagi-700 bg-hitagi-700 text-white",
  hachikuji: "border-hachikuji-700 bg-hachikuji-700 text-white",
  shinobu: "border-shinobu-700 bg-shinobu-700 text-white",
  gray: "border-gray-700 bg-gray-700 text-white",
  red: "border-red-700 bg-red-700 text-white",
  yellow: "border-yellow-700 bg-yellow-700 text-white",
  green: "border-green-700 bg-green-700 text-white",
  blue: "border-blue-700 bg-blue-700 text-white",
  indigo: "border-indigo-700 bg-indigo-700 text-white",
  purple: "border-purple-700 bg-purple-700 text-white",
  pink: "border-pink-700 bg-pink-700 text-white",
  orange: "border-orange-700 bg-orange-700 text-white",
  cyan: "border-cyan-700 bg-cyan-700 text-white",
  emerald: "border-emerald-700 bg-emerald-700 text-white",
} as const;

const sizeMaps = {
  sm: "px-1 py-0.5 text-sm",
  md: "px-2 py-1 text-base",
  lg: "px-3 py-1.5 text-md",
  xl: "px-4 py-2 text-lg",
};

function makePillColor() {
  const colorMaps = props.outlined ? outlinedColorMaps : filledColorMaps;

  return colorMaps[(props.color as ValidColor) ?? "gray"] ?? colorMaps.gray;
}

function makePillSize() {
  return sizeMaps[props.size ?? "sm"] ?? sizeMaps.sm;
}

const tagStyle = clsx(
  "select-none rounded-md align-middle",
  props.outlined ? "border-2" : undefined,
  makePillSize(),
  makePillColor(),
  isNone(props.href) ? undefined : "transition-opacity hover:border-opacity-75 hover:opacity-75",
  props.class
);
</script>

<template>
  <span :class="tagStyle" v-if="isNone(tagUrl)">{{ prettyTag }}</span>
  <NuxtLink :to="tagUrl" no-prefetch v-else>
    <span :class="tagStyle">{{ prettyTag }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import clsx from "clsx";

const validColors = [
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
  "emerald"
] as const;

type ValidColor = (typeof validColors)[number];

const colorMaps = {
  hitagi: "border-hitagi-500",
  gray: "border-gray-500",
  red: "border-red-500",
  yellow: "border-yellow-500",
  green: "border-green-500",
  blue: "border-blue-500",
  indigo: "border-indigo-500",
  purple: "border-purple-500",
  pink: "border-pink-500",
  orange: "border-orange-500",
  cyan: "border-cyan-500",
  emerald: "border-emerald-500"
} as const;

const props = defineProps<{
  tag: string;
  fullTag?: string;
  color?: string;
}>();

const tagUrl = computed(() => {
  if (isNone(props.fullTag)) return undefined;

  const q = encodeURIComponent(`${props.fullTag}$`);
  return `/search?q=${q}`;
});

function makeTagColor() {
  return colorMaps[(props.color as ValidColor) ?? "gray"] ?? colorMaps.gray;
}

const prettyTag = computed(() => {
  return props.tag.replace(/_/g, " ");
});

const tagStyle = clsx(
  "select-none rounded-md border-2 px-1 py-0.5 align-middle text-sm lowercase group-hover:opacity-75",
  makeTagColor(),
  !isNone(props.fullTag) ? "transition-opacity hover:border-opacity-75 hover:opacity-75" : undefined
);
</script>

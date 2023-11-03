<template>
  <span :class="tagStyle">{{ prettyTag }}</span>
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
  hitagi: "border-hitagi-700 bg-hitagi-700 text-white",
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
  emerald: "border-emerald-700 bg-emerald-700 text-white"
} as const;

const props = defineProps<{
  tag: string;
  color?: string;
}>();

function makeTagColor() {
  return colorMaps[(props.color as ValidColor) ?? "gray"] ?? colorMaps.gray;
}

const prettyTag = computed(() => {
  return props.tag.replace(/_/g, " ");
});

const tagStyle = clsx(
  "select-none rounded-md border-2 px-1 py-0.5 text-sm lowercase group-hover:opacity-75",
  makeTagColor()
);
</script>

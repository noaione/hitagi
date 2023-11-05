<template>
  <button :disabled="disabled" :class="buttonClass" @click="$emit('click')">
    <span :class="`transition btn-hb-${selectedColor}-text`">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import clsx from "clsx";

const props = defineProps<{
  disabled?: boolean;
  color?: string;
  class?: string;
  size?: string;
}>();

defineEmits<{
  (e: "click"): void;
}>();

const sizeMetadata = {
  sm: "border-[1px] py-1 px-2 text-sm rounded",
  md: "border-2 py-2 px-3 text-base rounded-md",
  lg: "border-[3px] py-3 px-4 text-lg rounded-lg",
  xl: "border-[4px] py-4 px-5 text-xl rounded-xl",
} as const;

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
  "emerald",
] as const;

type ValidColor = (typeof validColors)[number];

const selectedColor = computed(() => {
  const col = props.color ?? "hitagi";

  return validColors.includes(col as ValidColor) ? col : "hitagi";
});

const buttonClass = clsx(
  `group w-full bg-transparent transition disabled:cursor-not-allowed btn-hb-${selectedColor.value}`,
  sizeMetadata[(props.size ?? "md") as keyof typeof sizeMetadata] ?? sizeMetadata.md,
  props.class
);
</script>

<style scoped lang="postcss">
.btn-hb-hitagi {
  @apply border-hitagi-500 hover:border-hitagi-700 hover:bg-hitagi-700 disabled:border-hitagi-700 disabled:bg-hitagi-700;
}

.btn-hb-gray {
  @apply border-gray-500 hover:border-gray-700 hover:bg-gray-700 disabled:border-gray-700 disabled:bg-gray-700;
}

.btn-hb-red {
  @apply border-red-500 hover:border-red-700 hover:bg-red-700 disabled:border-red-700 disabled:bg-red-700;
}

.btn-hb-yellow {
  @apply border-yellow-500 hover:border-yellow-700 hover:bg-yellow-700 disabled:border-yellow-700 disabled:bg-yellow-700;
}

.btn-hb-green {
  @apply border-green-500 hover:border-green-700 hover:bg-green-700 disabled:border-green-700 disabled:bg-green-700;
}

.btn-hb-blue {
  @apply border-blue-500 hover:border-blue-700 hover:bg-blue-700 disabled:border-blue-700 disabled:bg-blue-700;
}

.btn-hb-indigo {
  @apply border-indigo-500 hover:border-indigo-700 hover:bg-indigo-700 disabled:border-indigo-700 disabled:bg-indigo-700;
}

.btn-hb-purple {
  @apply border-purple-500 hover:border-purple-700 hover:bg-purple-700 disabled:border-purple-700 disabled:bg-purple-700;
}

.btn-hb-pink {
  @apply border-pink-500 hover:border-pink-700 hover:bg-pink-700 disabled:border-pink-700 disabled:bg-pink-700;
}

.btn-hb-orange {
  @apply border-orange-500 hover:border-orange-700 hover:bg-orange-700 disabled:border-orange-700 disabled:bg-orange-700;
}

.btn-hb-cyan {
  @apply border-cyan-500 hover:border-cyan-700 hover:bg-cyan-700 disabled:border-cyan-700 disabled:bg-cyan-700;
}

.btn-hb-emerald {
  @apply border-emerald-500 hover:border-emerald-700 hover:bg-emerald-700 disabled:border-emerald-700 disabled:bg-emerald-700;
}

.btn-hb-hitagi-text {
  @apply text-hitagi-700 group-hover:text-white group-disabled:text-white dark:text-hitagi-300;
}

.btn-hb-gray-text {
  @apply text-gray-700 group-hover:text-white group-disabled:text-white dark:text-gray-300;
}

.btn-hb-red-text {
  @apply text-red-700 group-hover:text-white group-disabled:text-white dark:text-red-300;
}

.btn-hb-yellow-text {
  @apply text-yellow-700 group-hover:text-white group-disabled:text-white dark:text-yellow-300;
}

.btn-hb-green-text {
  @apply text-green-700 group-hover:text-white group-disabled:text-white dark:text-green-300;
}

.btn-hb-blue-text {
  @apply text-blue-700 group-hover:text-white group-disabled:text-white dark:text-blue-300;
}

.btn-hb-indigo-text {
  @apply text-indigo-700 group-hover:text-white group-disabled:text-white dark:text-indigo-300;
}

.btn-hb-purple-text {
  @apply text-purple-700 group-hover:text-white group-disabled:text-white dark:text-purple-300;
}

.btn-hb-pink-text {
  @apply text-pink-700 group-hover:text-white group-disabled:text-white dark:text-pink-300;
}

.btn-hb-orange-text {
  @apply text-orange-700 group-hover:text-white group-disabled:text-white dark:text-orange-300;
}

.btn-hb-cyan-text {
  @apply text-cyan-700 group-hover:text-white group-disabled:text-white dark:text-cyan-300;
}

.btn-hb-emerald-text {
  @apply text-emerald-700 group-hover:text-white group-disabled:text-white dark:text-emerald-300;
}
</style>
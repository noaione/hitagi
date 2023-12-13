<template>
  <div
    :class="`my-auto flex h-48 w-full flex-col items-center justify-center rounded-lg bg-themed-500 !bg-opacity-20 align-middle backdrop-blur-lg md:h-64 ${
      $props.class ?? ''
    }`"
  >
    <HitagiIconHeader
      class="text-themed-700 dark:text-themed-300"
      :class="{
        'animate-bounce': pending,
      }"
    />
    <LoadingText
      v-if="pending"
      class="font-incosolata text-sm font-semibold lowercase text-themed-700 dark:text-themed-300"
    />
    <span v-else class="font-incosolata text-sm font-semibold lowercase text-themed-700 dark:text-themed-300">
      No Results Found
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  class?: string;
  pending?: boolean;
}>();
</script>

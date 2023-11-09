<template>
  <div
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
defineProps<{
  class?: string;
  pending?: boolean;
}>();
</script>

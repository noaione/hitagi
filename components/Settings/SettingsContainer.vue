<template>
  <div class="mx-auto my-4 flex flex-col">
    <div class="mb-4 flex flex-row">
      <HitagiIconButton href="/settings" name="heroicons:arrow-left-circle" />
      <h1 class="dark:text-themed-300 text-themed-600 ml-2 text-2xl font-bold">{{ title }}</h1>
    </div>
    <div ref="wrapRef" class="flex w-full flex-col gap-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import autoAnimate from "@formkit/auto-animate";

defineProps<{
  title?: string;
}>();

const wrapRef = ref();

onMounted(() => {
  autoAnimate(wrapRef.value);
});
</script>

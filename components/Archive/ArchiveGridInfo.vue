<template>
  <NuxtLink :to="`/archive/${data.arcid}`">
    <div
      :class="`relative flex max-w-[9rem] cursor-pointer flex-col rounded-md bg-themed-300 bg-opacity-40 align-middle dark:bg-themed-950 dark:bg-opacity-60 md:max-w-[11rem] ${
        $props.class ?? ''
      }`"
      @mouseenter="activeFloat = true"
      @mouseleave="activeFloat = false"
      @touchstart="activeFloat = true"
      @touchend="activeFloat = false"
    >
      <ArchiveThumb :arc-id="data.arcid" class="mx-0 h-48 w-[9rem] md:h-64 md:w-44" inner-class="rounded-b-none" />
      <div
        class="group w-full bg-themed-950 !bg-opacity-50 backdrop-blur"
        :class="{
          'absolute bottom-0 max-h-[1.8rem] hover:max-h-full': compact,
          'max-h-full': compact && activeFloat,
        }"
      >
        <h2
          class="select-none whitespace-pre-wrap px-2 py-1 text-center text-sm font-semibold text-themed-100 decoration-themed-200 transition group-hover:underline group-hover:opacity-80"
          :class="{
            'max-h-[1.8rem] max-w-full overflow-hidden text-ellipsis whitespace-nowrap': compact,
            'max-h-full whitespace-normal': compact && activeFloat,
          }"
        >
          <span v-if="boolStrToBool(data.isnew)" class="text-blue-500">•</span>
          {{ data.title }}
        </h2>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const { data } = defineProps<{
  data: LRRArchiveMetadata;
  class?: string;
  compact?: boolean;
}>();

const activeFloat = ref(false);
</script>

<style scoped lang="postcss">
.tooltip-archive-enter-active,
.tooltip-archive-leave-active {
  transition: opacity 0.3s ease;
}

.tooltip-archive-enter-from,
.tooltip-archive-leave-to {
  opacity: 0;
}
</style>
